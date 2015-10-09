'use strict';

angular.module('race-day-fpv')
	.controller('EventCtrl', EventCtrl);

function EventCtrl(FIREBASE_REF, FPVSession, EventService, UserService, ngToast, $routeParams, $filter) {
	var _ref = FIREBASE_REF;
	var self = this;

	var eventId = $routeParams.eventId;

	var _racersRef = null;

	self.event = null;
	self.racers = null;
	self.me = null;
	_init();

	function _init() {
		self.today = $filter('date')(new Date(), 'yyyy-MM-dd');

		EventService.get(eventId)
			.then(function (result) {
				self.event = result.data;
				console.log('event loaded');
				_racersRef = _ref.child('events/' + eventId + '/pilots');

				self.racers = {};
				_racersRef.on('child_removed', function (child) {
					delete self.racers[child.key()];
				});
				_racersRef.on('child_added', function (child) {
					self.racers[child.key()] = child.val();
					if (FPVSession.user !== null && FPVSession.user.$id === child.key()) {
						self.me = child.val();
					}
					UserService.get(child.key())
						.then(function (result) {
							if (result.data !== null) {
								self.racers[child.key()].name = result.data.name;
								self.racers[child.key()].profileImageURL = result.data.profileImageURL;
							} else {
								EventService.removeRacer(eventId, child.key())
									.then(function () {
										ngToast.warning('Some user is gone');
									});
							}
						});
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
				});
		}
	};

	self.notGoing = function () {
		if (self.me !== null) {
			EventService.removeRacer(eventId, FPVSession.user.$id);
			UserService.removeEvent(FPVSession.user.$id, eventId)
				.then(function () {
					ngToast.success('Sad to see you go');
					self.me = null;
				});
		}
	};

	self.checkIn = function () {
		self.me.checkedIn = true;
		EventService.addRacer(eventId, FPVSession.user.$id, self.me)
			.then(function () {
				ngToast.success('Welcome');
			});
	};

	self.checkOut = function () {
		self.me.checkedIn = false;
		EventService.addRacer(eventId, FPVSession.user.$id, self.me)
			.then(function () {
				ngToast.success('Bye');
			});
	};
}
EventCtrl.$inject = ['FIREBASE_REF', 'FPVSession', 'EventService', 'UserService', 'ngToast', '$routeParams', '$filter'];
