'use strict';

angular.module('race-day-fpv')
	.factory('UserService', UserService);

function UserService(FIREBASE_URL, $http) {
	return {
		getUser: function (uid) {
			return $http.get(FIREBASE_URL + '/users/' + uid + '.json');
		}
	};
}

UserService.$inject = ['FIREBASE_URL', '$http'];
