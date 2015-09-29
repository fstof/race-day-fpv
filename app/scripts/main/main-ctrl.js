/* global Firebase */

'use strict';

angular.module('race-day-fpv')
	.controller('MainCtrl', function ($scope, $firebaseObject) {
		// now we can use $firebase to synchronize data between clients and the server!
		var ref = new Firebase('https://race-day-fpv.firebaseio.com');
		var sync = $firebaseObject(ref);
		console.log(sync);
	});
