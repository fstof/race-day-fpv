'use strict';

angular.module('race-day-fpv')
	.controller('EventAddCtrl', EventAddCtrl);

function EventAddCtrl(FPVSession, Event, ngToast, $location, $route) {
	var self = this;
	self.status = {
		opened: false
	};

	self.openCalendar = function () {
		self.status.opened = true;
	};

	self.event = {
		organiserId: FPVSession.user.$id
	};

	self.save = function () {
		self.event.date = self.event.date.getTime();
		Event.create(self.event, function (err) {
			if (err) {
				ngToast.danger('ERROR');
			} else {
				ngToast.success('Event added');
				$location.path('/events');
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
