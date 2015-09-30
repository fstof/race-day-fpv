'use strict';

//angular.module('race-day-fpv', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'firebase', 'ngRoute', 'ui.bootstrap'])
angular.module('race-day-fpv', ['ngAnimate', 'ngCookies', 'ngSanitize', 'firebase', 'ngRoute', 'ui.bootstrap'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'MainCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events', {
				templateUrl: 'partials/events.html',
				controller: 'MainCtrl',
				controllerAs: 'ctrl'
			})
			.when('/racers', {
				templateUrl: 'partials/racers.html',
				controller: 'MainCtrl',
				controllerAs: 'ctrl'
			})
			.otherwise({
				redirectTo: '/home'
			});
	})
;
