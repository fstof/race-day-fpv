'use strict';

angular.module('race-day-fpv')
	.factory('EventService', EventService);

function EventService(FIREBASE_URL, $http) {
	return {
		getEvent: function (id) {
			return $http.get(FIREBASE_URL + '/events/' + id + '.json');
		}
	};
}

EventService.$inject = ['FIREBASE_URL', '$http'];
