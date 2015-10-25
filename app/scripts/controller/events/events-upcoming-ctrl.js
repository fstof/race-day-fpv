'use strict';

angular.module('race-day-fpv')
	.controller('EventsUpcomingCtrl', EventsUpcomingCtrl);

function EventsUpcomingCtrl(FPVSession, Event) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.events = [];
	self.heading = 'Upcoming Events';
	self.subHeading = 'Where we meet';

	_init();

	function _init() {
		self.events = Event.allUpcomming;
	}
}
EventsUpcomingCtrl.$inject = ['FPVSession', 'Event'];
