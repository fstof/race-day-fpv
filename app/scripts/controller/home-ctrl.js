'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(FPVSession, FIREBASE_REF, EventService, $firebaseObject) {
	var _ref = FIREBASE_REF;
	var self = this;

	self.events = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			var myEventsRef = _ref.child('users/' + FPVSession.user.$id + '/events');

			myEventsRef.on('child_added', function (child) {
				EventService.getEvent(child.key())
					.then(function (result) {
						if (result.data === null) {
							$firebaseObject(myEventsRef.child(event.$id)).$remove();
						} else {
							self.events[child.key()] = result.data;
							self.events[child.key()].$id = child.key();
						}
					});
			});
		}
	}
}
HomeCtrl.$inject = ['FPVSession', 'FIREBASE_REF', 'EventService', '$firebaseObject'];
