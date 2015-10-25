'use strict';

angular.module('race-day-fpv')
	.controller('MeCtrl', MeCtrl);

function MeCtrl(FPVSession, User, Event, ngToast) {
	var self = this;

	self.eventCount = 0;
	self.events = {};
	self.myEvents = {};

	self.aircraftCount = 0;
	self.aircraft = {};
	self.myAircraft = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			self.events = User.getEvents(FPVSession.user.$id);

			self.events.$watch(function (change) {

				if (change.event === 'child_added' || change.event === 'child_changed') {
					Event.get(change.key)
						.$loaded(function (event) {
							if (event.name) {
								self.myEvents[event.$id] = event;
								self.eventCount++;
							} else { // orphan event now deleting
								User.removeEvent(FPVSession.user.$id, event.$id)
									.then(function () {
										ngToast.success('Removed an orphaned event');
									});
							}
						});
				} else if (change.event === 'child_removed') {
					delete self.myEvents[change.key];
					self.eventCount--;
				}
			});
		}
	}
}
MeCtrl.$inject = ['FPVSession', 'User', 'Event', 'ngToast'];
