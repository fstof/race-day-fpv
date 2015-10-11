'use strict';

angular.module('race-day-fpv')
	.factory('User', User);

function User(FIREBASE_REF, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var users = $firebaseArray(ref.child('users'));

	return {
		all: users,
		get: function (userId) {
			return $firebaseObject(ref.child('users').child(userId));
		},
		create: function (user) {
			return users.$add(user);
		},
		delete: function (user) {
			return users.$remove(user);
		},
		getEvents: function (userId) {
			return $firebaseArray(ref.child('users').child(userId).child('events'));
		},
		addEvent: function (userId, eventId, callback) {
			return ref.child('users').child(userId).child('events').child(eventId).set(true, callback);
		},
		removeEvent: function (userId, eventId) {
			return $firebaseObject(ref.child('users').child(userId).child('events').child(eventId)).$remove();
		}
	};
}
User.$inject = ['FIREBASE_REF', '$firebaseObject', '$firebaseArray'];
