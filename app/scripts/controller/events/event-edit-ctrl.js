'use strict';

angular.module('race-day-fpv')
	.controller('EventEditCtrl', EventEditCtrl);

function EventEditCtrl(FPVSession, Event, Notification, ngToast, $routeParams, $location, $route, $scope) {
	var self = this;
	self.heading = 'Edit Event';
	self.calanderOpen = false;
	self.event = {};
	var eventId = $routeParams.eventId;

	_init();

	function _init() {
		var ev = Event.get(eventId);

		ev.on('value', function (snap) {
			self.event = snap.val();
		});
		$scope.$on('$destroy', function() {
			ev.off();
		});
	}

	self.openCalendar = function () {
		self.calanderOpen = true;
	};

	self.save = function () {
		self.event.date = self.event.date.getTime ? self.event.date.getTime() : self.event.date;
		delete self.event.pilots;
		Event.update(eventId, self.event, function (err) {
			if (err) {
				ngToast.danger('Error');
			} else {
				ngToast.success('Saved');
				$location.path('/events/' + eventId);
				$route.reload();

				Notification.notifyEventUpdate(self.event);
			}
		});
	};

	self.cancel = function () {
		$location.path('/events/' + eventId);
		$route.reload();
	};
}
EventEditCtrl.$inject = ['FPVSession', 'Event', 'Notification', 'ngToast', '$routeParams', '$location', '$route', '$scope'];
