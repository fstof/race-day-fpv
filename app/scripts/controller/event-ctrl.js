'use strict';

angular.module('race-day-fpv')
	.controller('EventCtrl', EventsCtrl);

function EventsCtrl(FIREBASE_REF, FPVSession, $routeParams, $timeout, $firebaseArray, $firebaseObject) {
	var ref = FIREBASE_REF;
	var self = this;

	var eventId = $routeParams.eventId;

	var eventRef = null;
	var racersRef = null;
	var meRef = null;

	self.event = {};
	self.racers = [];
	self.me = {};
	self.mePath = null;
	_init();

	function _init() {
		eventRef = ref.child('events/' + eventId);
		eventRef.on('value', function (snap) {
			$timeout(function () {
				self.event = snap.val();

				racersRef = ref.child('events/' + eventId + '/pilots');

				racersRef.on('child_added', function (child) {
					$timeout(function () {
						var userRef = ref.child('users/' + child.key());
						var racer = $firebaseObject(userRef);
						self.racers.push(racer);
						if (FPVSession.user.$id === child.key()) {
							meRef = racersRef.child(child.key());
							self.me = $firebaseObject(meRef);
							self.mePath = meRef.toString();
							console.log(self.mePath);
							var mr = ref.child(self.mePath);
							console.log(mr);
						}
					});
				});
			});
		});
		/////
	}

	self.checkIn = function () {
		meRef.update(
			{'checkedIn': true}
		);
	};

	self.checkOut = function () {
		meRef.update(
			{'checkedIn': false}
		);
	};
}
EventsCtrl.$inject = ['FIREBASE_REF', 'FPVSession', '$routeParams', '$timeout', '$firebaseArray', '$firebaseObject'];
