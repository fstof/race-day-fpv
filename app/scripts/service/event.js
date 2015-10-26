'use strict';

angular.module('race-day-fpv')
	.factory('Event', Event);

function Event(FIREBASE_REF, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var events = $firebaseArray(ref.child('events').orderByChild('date'));

	return {
		all: events,
		allUpcomming: $firebaseArray(ref.child('events').orderByChild('date').startAt(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime())),
		allPast: $firebaseArray(ref.child('events').orderByChild('date').endAt(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime())),
		get: function (id) {
			return ref.child('events').child(id);
		},
		create: function (event, callback) {
			return ref.child('events').push(event, callback);
		},
		update: function (eventId, event, callback) {
			return ref.child('events/' + eventId).update(event, callback);
		},
		delete: function (eventId, callback) {
			return ref.child('events/' + eventId).set(null, callback);
		},
		getRacers: function (eventId) {
			return $firebaseArray(ref.child('events').child(eventId).child('pilots'));
		},
		getRacer: function (eventId, racerId) {
			return $firebaseObject(ref.child('events').child(eventId).child('pilots').child(racerId));
		},
		addRacer: function (eventId, racerId, racer, callback) {
			return ref.child('events').child(eventId).child('pilots').child(racerId).set(racer, callback);
		},
		removeRacer: function (eventId, racerId, callback) {
			return ref.child('events').child(eventId).child('pilots').child(racerId).set(null, callback);
		}
	};
}

Event.$inject = ['FIREBASE_REF', '$firebaseObject', '$firebaseArray'];
