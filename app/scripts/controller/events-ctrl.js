'use strict';

angular.module('race-day-fpv')
	.controller('EventsCtrl', EventsCtrl);

function EventsCtrl(FPVSession, FIREBASE_REF, $firebaseArray) {
	var _ref = FIREBASE_REF;
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.events = [];

	_init();

	function _init() {
		var eventsRef = _ref.child('events');
		self.events = $firebaseArray(eventsRef);
	}
}
EventsCtrl.$inject = ['FPVSession', 'FIREBASE_REF', '$firebaseArray'];
