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
		self.today = $filter('date')(new Date(), 'yyyy-MM-dd');

		self.event = Event.get(eventId);
		self.racers = Event.getRacers(eventId);

		self.racers.$watch(function (event) {

			if (event.event === 'child_added' || event.event === 'child_changed') {
				self.evRacers[event.key] = self.racers.$getRecord(event.key);

				if (FPVSession.user !== null && FPVSession.user.$id === event.key) {
					self.me = Event.getRacer(eventId, event.key);
				}
				User.get(event.key)
					.$loaded(function (loadedUser) {
						self.evRacers[event.key].name = loadedUser.name;
						self.evRacers[event.key].profileImageURL = loadedUser.profileImageURL;
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
					ngToast.danger('Error saving');
				} else {
					ngToast.success('Great, see you there');
				}
			});
		}
	};

	self.notGoing = function () {
		if (self.me !== null) {
			User.removeEvent(FPVSession.user.$id, eventId);
			Event.removeRacer(eventId, FPVSession.user.$id, function (err) {
				if (err) {
					ngToast.danger('Error saving');
				} else {
					ngToast.success('Sad to see you go');
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
