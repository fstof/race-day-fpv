'use strict';

angular.module('race-day-fpv')
	.controller('EventsCtrl', EventsCtrl);

function EventsCtrl(FPVSession, Event) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.events = [];

	_init();

	function _init() {
		self.events = Event.all;
	}
}
EventsCtrl.$inject = ['FPVSession', 'Event'];
