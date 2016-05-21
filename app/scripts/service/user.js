'use strict';

angular.module('race-day-fpv')
	.factory('User', User);

function User(FIREBASE_REF) {
	var ref = FIREBASE_REF;

	return {
		get: function (userId) {
			return ref.child('users').child(userId);
		},
		create: function (userId, user, callback) {
			return ref.child('users').child(userId).set(user, callback);
		}
	};
}
User.$inject = ['FIREBASE_REF'];
