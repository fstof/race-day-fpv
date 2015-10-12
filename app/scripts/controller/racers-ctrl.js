'use strict';

angular.module('race-day-fpv')
	.controller('RacersCtrl', RacersCtrl);

function RacersCtrl(UserService) {
	var self = this;
	self.users = {};
	_init();

	function _init() {
		UserService.all()
			.then(function (result) {
				self.users = result.data;
			})
	}
}
RacersCtrl.$inject = ['UserService'];
