'use strict';

angular.module('race-day-fpv')
	.controller('EventCtrl', EventsCtrl);

function EventsCtrl(FIREBASE_REF, FPVSession, $routeParams, $filter, $firebaseArray, $firebaseObject) {
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
			console.log("event loaded");
			_racersRef = ref.child('events/' + eventId + '/pilots');

			self.racers = $firebaseObject(_racersRef);
			self.racers.$loaded().then(function () {
				// To iterate the key/value pairs of the object, use angular.forEach()
				angular.forEach(self.racers, function (value, key) {
					console.log(key, value);
					if (FPVSession.user.$id === key) {
						_meRef = _racersRef.child(key);
						self.me = $firebaseObject(_meRef);
						self.me.$loaded().then(function () {
						});
					}
				});
			});

			//racersRef.on('child_added', function (child) {
			////$timeout(function () {
			//var userRef = ref.child('users/' + child.key());
			//var racer = $firebaseObject(userRef);
			//self.racers.push(racer);
			//if (FPVSession.user.$id === child.key()) {
			//meRef = racersRef.child(child.key());
			//self.me = $firebaseObject(meRef);
			//console.log('Child Me load time: ' + (new Date().getTime() - start));
			//}
			//console.log('Child load time: ' + (new Date().getTime() - start));
			////});
			//});
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
		self.me.$remove().then(function (ref) {
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
EventsCtrl.$inject = ['FIREBASE_REF', 'FPVSession', '$routeParams', '$filter', '$firebaseArray', '$firebaseObject'];
