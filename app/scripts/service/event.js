'use strict';

angular.module('race-day-fpv')
	.factory('Event', Event);

function Event(FIREBASE_REF, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var events = $firebaseArray(ref.child('events').orderByChild('date'));

	return {
		all: events,
		get: function (id) {
			return $firebaseObject(ref.child('events').child(id));
		},
		create: function (event, callback) {
			return ref.child('events').push(event, callback);
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
