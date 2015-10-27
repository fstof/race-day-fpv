'use strict';

angular.module('race-day-fpv')
	.controller('EventCtrl', EventCtrl);

function EventCtrl(FPVSession, Pilot, Event, ngToast, $routeParams, $filter, $timeout) {
	var self = this;

	var eventId = $routeParams.eventId;

	self.event = null;
	self.racers = null;
	self.evRacers = {};
	self.me = null;
	_init();

	function _init() {
		var ev = Event.get(eventId);
		self.racers = Event.getRacers(eventId);

		ev.on('value', function (snap) {
			self.event = snap.val();
			self.event.$id = eventId;
			self.eventDate = $filter('date')(new Date(self.event.date), 'yyyy-MM-dd');
		});


		self.today = $filter('date')(new Date(), 'yyyy-MM-dd');

		self.racers.$watch(function (event) {

			if (event.event === 'child_added' || event.event === 'child_changed') {
				self.evRacers[event.key] = self.racers.$getRecord(event.key);

				if (FPVSession.user !== null && FPVSession.user.$id === event.key) {
					var ra = Event.getRacer(eventId, event.key);
					ra.on('value', function (snap) {
						self.me = snap.val();
						self.me.$id = snap.key();
					});
				}
				var us = Pilot.get(event.key);
					us.once('value', function (snap) {
						var user = snap.val();
						self.evRacers[event.key].name = user.name;
						self.evRacers[event.key].avatar = user.avatar;
					});
			} else if (event.event === 'child_removed') {
				delete self.evRacers[event.key];
			}
		});
	}

	self.going = function () {
		if (self.me === null) {
			var obj = {checkedIn: false};
			Pilot.addEvent(FPVSession.user.$id, eventId);
			Event.addRacer(eventId, FPVSession.user.$id, obj, function (err) {
				if (err) {
					ngToast.danger('Error');
				} else {
					ngToast.success('See you there');
				}
			});
		}
	};

	self.notGoing = function () {
		if (self.me !== null) {
			Pilot.removeEvent(FPVSession.user.$id, eventId);
			Event.removeRacer(eventId, FPVSession.user.$id, function (err) {
				if (err) {
					ngToast.danger('Error');
				} else {
					ngToast.success('Too bad');
					self.me = null;
				}
			});
		}
	};

	self.goingToggle = function (event) {
		if (self.me !== null) {
			Pilot.removeEvent(FPVSession.user.$id, event.$id, function (err) {
				if (!err) {
					Event.removeRacer(event.$id, FPVSession.user.$id, function (err) {
						$timeout(function () {
							if (err) {
								ngToast.danger('Error');
							} else {
								ngToast.success('Too bad');
								self.me = null;
							}
						});
					});
				}
			});

		} else {
			var obj = {checkedIn: false};
			Pilot.addEvent(FPVSession.user.$id, event.$id, function (err) {
				if (!err) {
					Event.addRacer(event.$id, FPVSession.user.$id, obj, function (err) {
						$timeout(function () {
							if (err) {
								ngToast.danger('Error');
							} else {
								ngToast.success('See you there');
							}
						});
					});
				}
			});
		}
	};

	self.checkIn = function () {
		self.me.checkedIn = true;
		self.me.$save()
			.then(function () {
				ngToast.success('Welcome');
			});
	};

	self.checkOut = function () {
		self.me.checkedIn = false;
		self.me.$save()
			.then(function () {
				ngToast.success('Bye');
			});
	};
}
EventCtrl.$inject = ['FPVSession', 'Pilot', 'Event', 'ngToast', '$routeParams', '$filter', '$timeout'];
