'use strict';

angular.module('race-day-fpv')
	.controller('EventAddCtrl', EventAddCtrl);

function EventAddCtrl(FPVSession, FIREBASE_REF, $location, $timeout, $firebaseArray, $firebaseObject) {
	var ref = FIREBASE_REF;
	var self = this;
	self.status = {
		opened: false
	};

	self.open = function($event) {
		self.status.opened = true;
	};

	self.event = {
		organiserId: FPVSession.user.$id
	};

	self.save = function () {
		var listRef = ref.child('events');
		var newDataRef = listRef.push();

		newDataRef.update(self.event, function (error) {
			if (error) {
				console.log('Error updating data:', error);
			}
			$location.path('/events');
		});
	};

	self.cancel = function () {
		$location.path('/events');
	}
}
EventAddCtrl.$inject = ['FPVSession', 'FIREBASE_REF', '$location', '$timeout', '$firebaseArray', '$firebaseObject'];
