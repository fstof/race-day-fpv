'use strict';

angular.module('race-day-fpv')
	.controller('MeCtrl', MeCtrl);

function MeCtrl(FPVSession, Pilot, Event, ngToast, $scope) {
	var self = this;

	self.eventCount = 0;
	self.myEvents = {};

	self.aircraftCount = 0;
	self.myAircraft = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			var events = Pilot.getEvents(FPVSession.user.$id);

			events.on('child_added', function (snap) {
				var key = snap.key();
				var val = {val: snap.val()};
				val.$id = key;
				self.myEvents[key] = val;
				self.eventCount++;
				checkOrphan(key);
			});
			events.on('child_removed', function (snap) {
				delete self.myEvents[snap.key()];
				self.eventCount--;
				//checkOrphan(snap.key());
			});

			$scope.$on('$destroy', function() {
				events.off();
			});
		}
	}


	function checkOrphan(eventId) {
		Event.getName(eventId).once('value', function (snap) {
			if (!snap.exists()) {
				Pilot.removeEvent(FPVSession.user.$id, eventId, function (err) {
					if (!err) {
						ngToast.warning('Removed Orphan event');
					}
				})
			}
		});
	}
}
MeCtrl.$inject = ['FPVSession', 'Pilot', 'Event', 'ngToast', '$scope', '$timeout'];
