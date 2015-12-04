'use strict';
var firebase_base = 'https://<FIREBASE_ID>.firebaseio.com';

angular.module('race-day-fpv',
	['ngAnimate',
		'ngCookies',
		'ngSanitize',
		'ngToast',
		'firebase',
		'ngRoute',
		'ngResource',
		'ui.bootstrap',
		'btford.markdown'
	])

	.constant('FIREBASE_REF', new Firebase(firebase_base))
	.constant('FIREBASE_URL', firebase_base)

	.config(['ngToastProvider', function (ngToastProvider) {
		ngToastProvider.configure({
			verticalPosition: 'bottom',
			horizontalPosition: 'left'
		});
	}]);
