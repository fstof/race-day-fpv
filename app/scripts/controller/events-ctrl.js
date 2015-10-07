'use strict';

angular.module('race-day-fpv')
	.controller('EventsCtrl', EventsCtrl);

function EventsCtrl(FIREBASE_REF, $timeout, $firebaseArray, $firebaseObject) {
	var ref = FIREBASE_REF;
	var self = this;

	self.events = [];
	_init();

	function _init() {
		var eventsRef = ref.child('events');
		self.events = $firebaseArray(eventsRef);

	}

	self.toggle = function (event) {
		if (event.show) {
			event.show = false;
		} else {
			var userRef = ref.child('users/' + event.organiserId);
			event.organiser = $firebaseObject(userRef);
			event.show = true;
		}
	};

	self.delete = function (event) {
		$firebaseObject(ref.child('events/' + event.$id)).$remove();
	};
}
EventsCtrl.$inject = ['FIREBASE_REF', '$timeout', '$firebaseArray', '$firebaseObject'];
