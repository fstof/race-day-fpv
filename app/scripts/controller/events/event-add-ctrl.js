'use strict';

angular.module('race-day-fpv')
	.controller('EventAddCtrl', EventAddCtrl);

function EventAddCtrl(FPVSession, Event, Notification, RDFDateUtil, ngToast, $location, $route) {
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

				Notification.create({
					message:
					'\ud83c\udfc1 Race Day FPV \ud83c\udfc1\n' +
					'New event created\n' +
					'Name: ' + self.event.name + '\n' +
					'Date: ' + RDFDateUtil.stringValue(self.event.date) + '\n' +
					'Time: ' + RDFDateUtil.stringTimeValue(self.event.date) + '\n' +
					'Venue: ' + self.event.venue + '\n' +
					'Pindrop: ' + self.event.map + '\n\n' +
					'To join this event register here:\n' + $location.absUrl()
				});
			}
		});
	};

	self.cancel = function () {
		$location.path('/events');
		$route.reload();
	};
}
EventAddCtrl.$inject = ['FPVSession', 'Event', 'Notification', 'RDFDateUtil', 'ngToast', '$location', '$route'];
