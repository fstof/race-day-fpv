'use strict';

angular.module('race-day-fpv')
	.factory('UserService', UserService);

function UserService(FPVSession, FIREBASE_URL, $http) {
	return {
		all: function () {
			return $http({
				method: 'get',
				url: FIREBASE_URL + '/users.json',
				params: {}
			});
		},
		get: function (userId) {
			return $http({
				method: 'get',
				url: FIREBASE_URL + '/users/' + userId + '.json',
				params: {}
			});
		},
		create: function (user) {
			return $http({
				method: 'post',
				url: FIREBASE_URL + '/users.json',
				params: {auth: FPVSession.authData.token},
				data: user
			});
		},
		delete: function (userId) {
			return $http({
				method: 'delete',
				url: FIREBASE_URL + '/users/' + userId + '.json',
				params: {auth: FPVSession.authData.token}
			});
		},
		getEvents: function (userId) {
			return $http({
				method: 'get',
				url: FIREBASE_URL + '/users/' + userId + '/events.json',
				params: {shallow: true}
			});
		},
		addEvent: function (userId, eventId) {
			return $http({
				method: 'patch',
				url: FIREBASE_URL + '/users/' + userId + '/events/' + eventId + '.json',
				params: {auth: FPVSession.authData.token},
				data: {going: true}
			});
		},
		removeEvent: function (userId, eventId) {
			return $http({
				method: 'delete',
				url: FIREBASE_URL + '/users/' + userId + '/events/' + eventId + '.json',
				params: {auth: FPVSession.authData.token}
			});
		}
	};
}

UserService.$inject = ['FPVSession', 'FIREBASE_URL', '$http'];
