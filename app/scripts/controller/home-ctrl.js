'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(FPVSession, FIREBASE_REF, EventService, $firebaseObject) {
	var ref = FIREBASE_REF;
	var self = this;

	self.events = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			var eventsRef = ref.child('users/' + FPVSession.user.$id + '/events');

			eventsRef.on('child_added', function (child) {
				console.log(child.key(), child.val());

				EventService.getEvent(child.key())
					.then(function (result) {
						self.events[child.key()] = result.data;
						self.events[child.key()].id = child.key();
					});
			});

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
}
HomeCtrl.$inject = ['FPVSession', 'FIREBASE_REF', 'EventService', '$firebaseObject'];
