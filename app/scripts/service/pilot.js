'use strict';

angular.module('race-day-fpv')
	.factory('Pilot', Pilot);

function Pilot(FIREBASE_REF, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var pilots = $firebaseArray(ref.child('pilots'));

	return {
		all: pilots,
		get: function (userId) {
			return ref.child('pilots').child(userId);
		},
		create: function (user) {
			return pilots.$add(user);
		},
		delete: function (user) {
			return pilots.$remove(user);
		},
		getEvents: function (userId) {
			return $firebaseArray(ref.child('pilots').child(userId).child('events'));
		},
		getEvents2: function (userId) {
			return ref.child('pilots').child(userId).child('events');
		},
		addEvent: function (userId, eventId, callback) {
			return ref.child('pilots').child(userId).child('events').child(eventId).set(true, callback);
		},
		removeEvent: function (userId, eventId, callback) {
			return ref.child('pilots').child(userId).child('events').child(eventId).set(null, callback);
		}
	};
}
Pilot.$inject = ['FIREBASE_REF', '$firebaseObject', '$firebaseArray'];
