'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(FPVSession, User, Event, ngToast) {
	var self = this;

	self.events = {};
	self.myevents = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			self.events = User.getEvents(FPVSession.user.$id);

			self.events.$watch(function (change) {

				if (change.event === 'child_added' || change.event === 'child_changed') {
					Event.get(change.key)
						.$loaded(function (event) {
							if (event.name) {
								self.myevents[event.$id] = event;
							} else { // orphan event now deleting
								User.removeEvent(FPVSession.user.$id, event.$id)
									.then(function () {
										ngToast.success('Removed an orphaned event');
									});
							}
						});
				} else if (change.event === 'child_removed') {
					delete self.myevents[change.key];
				}
			});
		}
	}
}
HomeCtrl.$inject = ['FPVSession', 'User', 'Event', 'ngToast'];
