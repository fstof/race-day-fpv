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
			console.log(event);
			if (event.event === 'child_added') {
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
			} else if (event.event === 'child_changed') {
				User.get(event.key)
					.$loaded(function (loadedUser) {
						self.evRacers[event.key].name = loadedUser.name;
						self.evRacers[event.key].profileImageURL = loadedUser.profileImageURL;
					});
				if (FPVSession.user !== null && FPVSession.user.$id === event.key) {
					self.me = Event.getRacer(eventId, event.key);
				}
			}
		});

		//EventService.get(eventId)
		//	.then(function (result) {
		//		self.event = result.data;
		//		console.log('event loaded');
		//		_racersRef = _ref.child('events/' + eventId + '/pilots');
		//
		//		self.racers = {};
		//		_racersRef.on('child_removed', function (child) {
		//			delete self.racers[child.key()];
		//		});
		//		_racersRef.on('child_added', function (child) {
		//			self.racers[child.key()] = child.val();
		//			if (FPVSession.user !== null && FPVSession.user.$id === child.key()) {
		//				self.me = child.val();
		//			}
		//			UserService.get(child.key())
		//				.then(function (result) {
		//					if (result.data !== null) {
		//						self.racers[child.key()].name = result.data.name;
		//						self.racers[child.key()].profileImageURL = result.data.profileImageURL;
		//					} else {
		//						EventService.removeRacer(eventId, child.key())
		//							.then(function () {
		//								ngToast.warning('Some user is gone');
		//							});
		//					}
		//				});
		//		});
		//	});
	}

	//function _init() {
	//	self.today = $filter('date')(new Date(), 'yyyy-MM-dd');
	//
	//	EventService.get(eventId)
	//		.then(function (result) {
	//			self.event = result.data;
	//			console.log('event loaded');
	//			_racersRef = _ref.child('events/' + eventId + '/pilots');
	//
	//			self.racers = {};
	//			_racersRef.on('child_removed', function (child) {
	//				delete self.racers[child.key()];
	//			});
	//			_racersRef.on('child_added', function (child) {
	//				self.racers[child.key()] = child.val();
	//				if (FPVSession.user !== null && FPVSession.user.$id === child.key()) {
	//					self.me = child.val();
	//				}
	//				UserService.get(child.key())
	//					.then(function (result) {
	//						if (result.data !== null) {
	//							self.racers[child.key()].name = result.data.name;
	//							self.racers[child.key()].profileImageURL = result.data.profileImageURL;
	//						} else {
	//							EventService.removeRacer(eventId, child.key())
	//								.then(function () {
	//									ngToast.warning('Some user is gone');
	//								});
	//						}
	//					});
	//			});
	//		});
	//}

	self.going = function () {
		if (self.me === null) {
			var obj = {checkedIn: false};
			Event.addRacer(eventId, FPVSession.user.$id, obj);
			User.addEvent(FPVSession.user.$id, eventId, function (err) {
				if (err) {
					ngToast.danger('Error saving');
				} else {
					ngToast.success('Great, see you there');
					self.me = Event.getRacer(eventId, FPVSession.user.$id);
				}
			});
		}
	};

	//self.going = function () {
	//	if (self.me === null) {
	//		var obj = {checkedIn: false};
	//		EventService.addRacer(eventId, FPVSession.user.$id, obj);
	//		UserService.addEvent(FPVSession.user.$id, eventId)
	//			.then(function () {
	//				ngToast.success('Great, see you there');
	//				self.me = obj;
	//			});
	//	}
	//};

	self.notGoing = function () {
		if (self.me !== null) {
			Event.removeRacer(eventId, FPVSession.user.$id);
			User.removeEvent(FPVSession.user.$id, eventId)
				.then(function () {
					ngToast.success('Sad to see you go');
					self.me = null;
				});
		}
	};

	//self.notGoing = function () {
	//	if (self.me !== null) {
	//		EventService.removeRacer(eventId, FPVSession.user.$id);
	//		UserService.removeEvent(FPVSession.user.$id, eventId)
	//			.then(function () {
	//				ngToast.success('Sad to see you go');
	//				self.me = null;
	//			});
	//	}
	//};

	self.checkIn = function () {
		self.me.checkedIn = true;
		self.me.$save()
			.then(function () {
				ngToast.success('Welcome');
			});
	};

	//self.checkIn = function () {
	//	self.me.checkedIn = true;
	//	EventService.addRacer(eventId, FPVSession.user.$id, self.me)
	//		.then(function () {
	//			ngToast.success('Welcome');
	//		});
	//};

	self.checkOut = function () {
		self.me.checkedIn = false;
		self.me.$save()
			.then(function () {
				ngToast.success('Bye');
			});
	};

	//self.checkOut = function () {
	//	self.me.checkedIn = false;
	//	EventService.addRacer(eventId, FPVSession.user.$id, self.me)
	//		.then(function () {
	//			ngToast.success('Bye');
	//		});
	//};
}
EventCtrl.$inject = ['FPVSession', 'User', 'Event', 'ngToast', '$routeParams', '$filter'];
