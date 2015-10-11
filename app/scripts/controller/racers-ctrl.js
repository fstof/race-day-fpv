'use strict';

angular.module('race-day-fpv')
	.controller('RacersCtrl', RacersCtrl);

function RacersCtrl(User) {
	var self = this;

	self.users = {};
	_init();

	function _init() {
		self.users = User.all;
	}
}
RacersCtrl.$inject = ['User'];
