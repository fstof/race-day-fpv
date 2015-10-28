'use strict';

angular.module('race-day-fpv')
	.controller('PilotsCtrl', PilotsCtrl);

function PilotsCtrl(Pilot) {
	var self = this;

	self.pilots = {};
	_init();

	function _init() {
		self.pilots = Pilot.all;
	}
}
PilotsCtrl.$inject = ['Pilot'];
