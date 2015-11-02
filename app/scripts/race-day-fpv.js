'use strict';

angular.module('race-day-fpv', ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngToast', 'firebase', 'ngRoute', 'ngResource', 'ui.bootstrap'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/me/events', {
				templateUrl: 'partials/my-events.html',
				controller: 'MeCtrl',
				controllerAs: 'ctrl'
			})
			.when('/me/frequencies', {
				templateUrl: 'partials/my-frequencies.html',
				controller: 'MeCtrl',
				controllerAs: 'ctrl'
			})
			.when('/me/edit', {
				templateUrl: 'partials/pilots/pilot-edit.html',
				controller: 'PilotEditCtrl',
				controllerAs: 'ctrl'
			})
			.when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/upcoming', {
				templateUrl: 'partials/events/events.html',
				controller: 'EventsUpcomingCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/past', {
				templateUrl: 'partials/events/events.html',
				controller: 'EventsPastCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/add', {
				templateUrl: 'partials/events/event-edit.html',
				controller: 'EventAddCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/:eventId', {
				templateUrl: 'partials/events/event.html',
				controller: 'EventCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/:eventId/start', {
				templateUrl: 'partials/events/event-start.html',
				controller: 'EventStartCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/:eventId/edit', {
				templateUrl: 'partials/events/event-edit.html',
				controller: 'EventEditCtrl',
				controllerAs: 'ctrl'
			})
			.when('/pilots', {
				templateUrl: 'partials/pilots/pilots.html',
				controller: 'PilotsCtrl',
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
