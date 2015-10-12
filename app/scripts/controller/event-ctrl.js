'use strict';

angular.module('race-day-fpv')
	.controller('EventCtrl', EventCtrl);

function EventCtrl(FPVSession, EventService, UserService, ngToast, $routeParams, $filter) {
	var self = this;
	var eventId = $routeParams.eventId;

	self.event = null;
	self.racers = null;
	self.me = null;
	_init();

	function _init() {
		self.today = $filter('date')(new Date(), 'yyyy-MM-dd');

		EventService.get(eventId)
			.then(function (result) {
				self.event = result.data;
				_loadRacers(eventId);
			});
	}

	function _loadRacers(eventId) {
		EventService.getRacers(eventId)
			.then(function (result) {
				console.log(result);
				self.racers = result.data;
				angular.forEach(self.racers, function (val, key) {
					UserService.get(key)
						.then(function (result) {
							self.racers[key].profileImageURL = result.data.profileImageURL;
							self.racers[key].name = result.data.name;
							if (FPVSession.user !== null && FPVSession.user.$id === key) {
								self.me = self.racers[key];
							}
						})
				});
			});
	}

	self.going = function () {
		if (self.me === null) {
			var obj = {checkedIn: false};
			EventService.addRacer(eventId, FPVSession.user.$id, obj);
			UserService.addEvent(FPVSession.user.$id, eventId)
				.then(function () {
					ngToast.success('Great, see you there');
					self.me = obj;
					_loadRacers(eventId);
				});
		}
	};

	self.notGoing = function () {
		if (self.me !== null) {
			EventService.removeRacer(eventId, FPVSession.user.$id);
			UserService.removeEvent(FPVSession.user.$id, eventId)
				.then(function () {
					ngToast.success('Sad to see you go');
					delete self.racers[FPVSession.user.$id];
					self.me = null;
				});
		}
	};

	self.checkIn = function () {
		EventService.addRacer(eventId, FPVSession.user.$id, {checkedIn: true})
			.then(function () {
				ngToast.success('Welcome');
				self.me.checkedIn = true;
			});
	};

	self.checkOut = function () {
		EventService.addRacer(eventId, FPVSession.user.$id, {checkedIn: false})
			.then(function () {
				ngToast.success('Bye');
				self.me.checkedIn = false;
			});
	};
}
EventCtrl.$inject = ['FPVSession', 'EventService', 'UserService', 'ngToast', '$routeParams', '$filter'];
