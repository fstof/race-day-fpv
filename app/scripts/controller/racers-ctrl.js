'use strict';

angular.module('race-day-fpv')
	.controller('RacersCtrl', RacersCtrl);

function RacersCtrl(FIREBASE_REF, $firebaseArray) {
	var ref = FIREBASE_REF;
	var self = this;

	self.users = {};
	_init();

	function _init() {
		var listRef = ref.child('users');
		self.users = $firebaseArray(listRef);
	}
}
RacersCtrl.$inject = ['FIREBASE_REF', '$firebaseArray'];
