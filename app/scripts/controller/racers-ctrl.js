'use strict';

angular.module('race-day-fpv')
	.controller('RacersCtrl', RacersCtrl);

function RacersCtrl($firebaseArray) {
	// now we can use $firebase to synchronize data between clients and the server!
	var ref = new Firebase('https://race-day-fpv.firebaseio.com');
	var self = this;

	self.users = {};
	_init();

	function _init() {
		var listRef = ref.child('users');
		self.users = $firebaseArray(listRef);
	}
}
RacersCtrl.$inject = ['$firebaseArray'];
