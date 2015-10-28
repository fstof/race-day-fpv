'use strict';

angular.module('race-day-fpv')
	.controller('EventAddCtrl', EventAddCtrl);

function EventAddCtrl(FPVSession, Event, ngToast, $location, $route) {
	var self = this;
	self.heading = 'New Event';
	self.calanderOpen = false;

	self.openCalendar = function () {
		self.calanderOpen = true;
	};

	self.event = {
		organiserId: FPVSession.user.$id
	};

	self.save = function () {
		self.event.date = self.event.date.getTime();
		var eventId = Event.create(self.event, function (err) {
			if (err) {
				ngToast.danger('Error');
			} else {
				ngToast.success('Saved');
				$location.path('/events/' + eventId.key());
				$route.reload();
			}
		});
	};

	self.cancel = function () {
		$location.path('/events');
		$route.reload();
	};
}
EventAddCtrl.$inject = ['FPVSession', 'Event', 'ngToast', '$location', '$route'];
