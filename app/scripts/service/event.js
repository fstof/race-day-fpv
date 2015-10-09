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
			return $firebaseArray(ref.child('events').child(eventId).child('racers'));
		},
		addRacer: function (eventId, racerId, racer) {
			return $firebaseObject(ref.child('events').child(eventId).child('racers').child(racerId)).$add(racer);
		},
		removeRacer: function (eventId, racerId) {
			return $firebaseArray(ref.child('events').child(eventId).child('racers')).$remove(racerId);
		}
	};
}

Event.$inject = ['FIREBASE_REF', '$firebaseObject', '$firebaseArray'];
