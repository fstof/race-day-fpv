'use strict';

angular.module('race-day-fpv')
	.controller('EventAddCtrl', EventAddCtrl);

function EventAddCtrl(FPVSession, EventService, ngToast, $location, $route) {
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
		EventService.create(self.event)
			.then(function () {
				ngToast.success('Event added');
				$location.path('/events');
				$route.reload();
			})
			.catch(function () {
				ngToast.danger('ERROR');
			});
	};

	self.cancel = function () {
		$location.path('/events');
		$route.reload();
	};
}
EventAddCtrl.$inject = ['FPVSession', 'EventService', 'ngToast', '$location', '$route'];
