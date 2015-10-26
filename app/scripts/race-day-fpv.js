'use strict';

angular.module('race-day-fpv', ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngToast', 'firebase', 'ngRoute', 'ngResource', 'ui.bootstrap'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
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
			.when('/events/me', {
				templateUrl: 'partials/events/me.html',
				controller: 'MeCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/:eventId', {
				templateUrl: 'partials/event.html',
				controller: 'EventCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/add', {
				templateUrl: 'partials/events/event-add.html',
				controller: 'EventAddCtrl',
				controllerAs: 'ctrl'
			})
			.when('/events/edit/:eventId', {
				templateUrl: 'partials/events/event-add.html',
				controller: 'EventEditCtrl',
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
