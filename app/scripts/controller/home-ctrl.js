'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(FPVSession, FIREBASE_REF, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var self = this;

	self.events = [];
	_init();

	function _init() {
		if (FPVSession.user != null) {
			var eventsRef = ref.child('users/' + FPVSession.user.$id + '/events');
			self.events = $firebaseArray(eventsRef);
			self.events.$loaded().then(function (elem) {
				console.log(elem);
			});
		}
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
}
HomeCtrl.$inject = ['FPVSession', 'FIREBASE_REF', '$firebaseObject', '$firebaseArray'];
