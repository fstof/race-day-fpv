'use strict';

angular.module('race-day-fpv')
	.controller('EventCtrl', EventCtrl);

function EventCtrl(FIREBASE_REF, FPVSession, UserService, $routeParams, $filter, $firebaseObject) {
	var ref = FIREBASE_REF;
	var self = this;

	var eventId = $routeParams.eventId;

	var _eventRef = null;
	var _racersRef = null;
	var _meRef = null;
	var _userRef = FPVSession.userRef;

	self.event = null;
	self.racers = null;
	self.me = null;
	_init();

	function _init() {
		self.today = $filter('date')(new Date(), 'yyyy-MM-dd');

		_eventRef = ref.child('events/' + eventId);
		self.event = $firebaseObject(_eventRef);
		self.event.$loaded().then(function () {
			console.log('event loaded');
			_racersRef = ref.child('events/' + eventId + '/pilots');

			//self.racers = $firebaseObject(_racersRef);
			//self.racers.$loaded().then(function () {
			//	// To iterate the key/value pairs of the object, use angular.forEach()
			//	angular.forEach(self.racers, function (value, key) {
			//		if (FPVSession.user !== null && FPVSession.user.$id === key) {
			//			_meRef = _racersRef.child(key);
			//			self.me = $firebaseObject(_meRef);
			//			self.me.$loaded().then(function () {
			//			});
			//		}
			//		UserService.getUser(key)
			//			.then(function (result) {
			//				console.log(result.data);
			//				value.name = result.data.name;
			//				value.profileImageURL = result.data.profileImageURL;
			//			});
			//	});
			//});

			self.racers = {};
			_racersRef.on('child_removed', function (child) {
				delete self.racers[child.key()];
			});
			_racersRef.on('child_added', function (child) {
				self.racers[child.key()] = child;
				if (FPVSession.user !== null && FPVSession.user.$id === child.key()) {
					_meRef = _racersRef.child(child.key());
					self.me = $firebaseObject(_meRef);
				}
				UserService.getUser(child.key())
					.then(function (result) {
						child.name = result.data.name;
						child.profileImageURL = result.data.profileImageURL;
					});
			});
		});
	}

	self.going = function () {
		_meRef = _racersRef.child(FPVSession.user.$id);
		_meRef.set({
			checkedIn: false
		});
		self.me = $firebaseObject(_meRef);
		self.me.$loaded().then(function () {
		});
		_userRef.child('events/' + self.event.$id).set(true);
	};

	self.notGoing = function () {
		self.me.$remove().then(function () {
			self.me = null;
		});
		$firebaseObject(_userRef.child('events/' + self.event.$id)).$remove();
	};

	self.checkIn = function () {
		self.me.checkedIn = true;
		self.me.$save();
	};

	self.checkOut = function () {
		self.me.checkedIn = false;
		self.me.$save();
	};
}
EventCtrl.$inject = ['FIREBASE_REF', 'FPVSession', 'UserService', '$routeParams', '$filter', '$firebaseObject'];
