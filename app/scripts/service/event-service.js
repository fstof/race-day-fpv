'use strict';

angular.module('race-day-fpv')
	.factory('EventService', EventService);

function EventService(FPVSession, FIREBASE_URL, $http) {


	return {
		all: function () {
			return $http({
				method: 'get',
				url: FIREBASE_URL + '/events.json',
				params: {}
			});
		},
		get: function (eventId) {
			return $http({
				method: 'get',
				url: FIREBASE_URL + '/events/' + eventId + '.json',
				params: {}
			});
		},
		create: function (event) {
			return $http({
				method: 'post',
				url: FIREBASE_URL + '/events.json',
				params: {auth: FPVSession.authData.token},
				data: event
			});
		},
		delete: function (eventId) {
			return $http({
				method: 'delete',
				url: FIREBASE_URL + '/events/' + eventId + '.json',
				params: {auth: FPVSession.authData.token}
			});
		},
		getRacers: function (eventId) {
			return $http({
				method: 'get',
				url: FIREBASE_URL + '/events/' + eventId + '/pilots.json',
				params: {}
			});
		},
		addRacer: function (eventId, racerId, racer) {
			return $http({
				method: 'patch',
				url: FIREBASE_URL + '/events/' + eventId + '/pilots/' + racerId + '.json',
				params: {auth: FPVSession.authData.token},
				data: racer
			});
		},
		removeRacer: function (eventId, racerId) {
			return $http({
				method: 'delete',
				url: FIREBASE_URL + '/events/' + eventId + '/pilots/' + racerId + '.json',
				params: {auth: FPVSession.authData.token}
			});
		}
	};
}

EventService.$inject = ['FPVSession', 'FIREBASE_URL', '$http'];
