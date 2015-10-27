'use strict';

angular.module('race-day-fpv')
	.factory('User', User);

function User(FIREBASE_REF, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var users = $firebaseArray(ref.child('users'));

	return {
		get: function (userId) {
			return ref.child('users').child(userId);
		},
		create: function (user) {
			return users.$add(user);
		}
	};
}
User.$inject = ['FIREBASE_REF', '$firebaseObject', '$firebaseArray'];
