'use strict';

angular.module('race-day-fpv')
	.controller('MeCtrl', MeCtrl);

function MeCtrl(FPVSession, Pilot, Event, ngToast) {
	var self = this;

	self.eventCount = 0;
	self.myEvents = {};

	self.aircraftCount = 0;
	self.myAircraft = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			var events = Pilot.getEvents2(FPVSession.user.$id);

			events.on('child_added', function (snap) {
				var key = snap.key();
				var val = {val: snap.val()};
				val.$id = key;
				self.myEvents[key] = val;
				self.eventCount++;
			});
			events.on('child_removed', function (snap) {
				delete self.myEvents[snap.key()];
				self.eventCount--;
			});
		}
	}
}
MeCtrl.$inject = ['FPVSession', 'Pilot', 'Event', 'ngToast'];
