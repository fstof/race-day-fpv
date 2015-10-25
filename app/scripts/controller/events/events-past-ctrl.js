'use strict';

angular.module('race-day-fpv')
	.controller('EventsPastCtrl', EventsPastCtrl);

function EventsPastCtrl(FPVSession, Event) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.events = [];
	self.heading = 'Past Events';
	self.subHeading = 'Where we met';

	_init();

	function _init() {
		self.events = Event.allPast;
	}
}
EventsPastCtrl.$inject = ['FPVSession', 'Event'];
