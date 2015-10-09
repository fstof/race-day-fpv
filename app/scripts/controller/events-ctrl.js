'use strict';

angular.module('race-day-fpv')
	.controller('EventsCtrl', EventsCtrl);

function EventsCtrl(FPVSession, EventService) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.events = [];

	_init();

	function _init() {
		EventService.all()
			.then(function (result) {
				self.events = result.data;
				angular.forEach(self.events, function (value, key) {
					value.$id = key;
				});
			});
	}
}
EventsCtrl.$inject = ['FPVSession', 'EventService'];
