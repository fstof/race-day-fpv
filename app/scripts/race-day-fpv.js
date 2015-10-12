'use strict';

//angular.module('race-day-fpv', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'firebase', 'ngRoute', 'ui.bootstrap'])
angular.module('race-day-fpv', ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngToast', 'firebase', 'ngRoute', 'ngResource', 'ui.bootstrap'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events', {
				templateUrl: 'partials/events.html',
				controller: 'EventsCtrl',
				controllerAs: 'ctrl'
			})
			.when('/event/:eventId', {
				templateUrl: 'partials/event.html',
				controller: 'EventCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/add', {
				templateUrl: 'partials/event-add.html',
				controller: 'EventAddCtrl',
				controllerAs: 'ctrl'
			})
			.when('/racers', {
				templateUrl: 'partials/racers.html',
				controller: 'RacersCtrl',
				controllerAs: 'ctrl'
			})
			.when('/manage', {
				templateUrl: 'partials/manage/index.html',
				controller: 'ManageCtrl',
				controllerAs: 'ctrl'
			})
			.otherwise({
				redirectTo: '/home'
			});
	}])

	.config(['ngToastProvider', function (ngToastProvider) {
		ngToastProvider.configure({
			verticalPosition: 'bottom',
			horizontalPosition: 'left'
		});
	}])

	.constant('FIREBASE_REF', new Firebase('https://race-day-fpv.firebaseio.com'))
	.constant('FIREBASE_URL', 'https://race-day-fpv.firebaseio.com');
