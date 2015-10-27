'use strict';

angular.module('race-day-fpv')
	.controller('RacersCtrl', RacersCtrl);

function RacersCtrl(Pilot) {
	var self = this;

	self.pilots = {};
	_init();

	function _init() {
		self.pilots = Pilot.all;
	}
}
RacersCtrl.$inject = ['Pilot'];
