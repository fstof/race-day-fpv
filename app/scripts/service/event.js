'use strict';

angular.module('race-day-fpv')
	.factory('Event', Event);

function Event(FIREBASE_REF, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var events = $firebaseArray(ref.child('events'));

	return {
		all: events,
		get: function (id) {
			return $firebaseObject(ref.child('events').child(id));
		},
		create: function (event) {
			return events.$add(event);
		},
		delete: function (event) {
			return events.$remove(event);
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
		removeRacer: function (eventId, racerId) {
			return $firebaseObject(ref.child('events').child(eventId).child('pilots').child(racerId)).$remove();
		}
	};
}

Event.$inject = ['FIREBASE_REF', '$firebaseObject', '$firebaseArray'];
