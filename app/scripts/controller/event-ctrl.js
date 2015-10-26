'use strict';

angular.module('race-day-fpv')
	.controller('EventCtrl', EventCtrl);

function EventCtrl(FPVSession, User, Event, ngToast, $routeParams, $filter) {
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
					self.me = Event.getRacer(eventId, event.key);
				}
				var us = User.get(event.key);
					us.once('value', function (snap) {
						var user = snap.val();
						self.evRacers[event.key].name = user.name;
						self.evRacers[event.key].profileImageURL = user.profileImageURL;
					});
			} else if (event.event === 'child_removed') {
				delete self.evRacers[event.key];
			}
		});
	}

	self.going = function () {
		if (self.me === null) {
			var obj = {checkedIn: false};
			User.addEvent(FPVSession.user.$id, eventId);
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
			User.removeEvent(FPVSession.user.$id, eventId);
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
EventCtrl.$inject = ['FPVSession', 'User', 'Event', 'ngToast', '$routeParams', '$filter'];
