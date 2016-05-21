'use strict';

angular.module('race-day-fpv')
	.controller('RacerCtrl', MeCtrl);

function MeCtrl(FPVSession, RDFDateUtil, Pilot, Event, ngToast, $timeout, $scope, $routeParams) {
	var self = this;

	var racerId = $routeParams.racerId;

	self.eventCount = 0;
	self.events = {};

	_init();

	function _init() {
		var events = Pilot.getEvents(racerId);
		events.on('child_added', function (snap) {
			var key = snap.key();
			var val = {val: snap.val()};
			var ev = Event.get(key);
			ev.once('value', function (snap) {
				if (RDFDateUtil.startOfDate(new Date(snap.val().date)).getTime() >= RDFDateUtil.todayDateTime()) {
					val.$id = key;
					self.events[key] = val;
					self.eventCount++;
				}
			});
			checkOrphan(key);
		});
		events.on('child_removed', function (snap) {
			delete self.events[snap.key()];
			self.eventCount--;
		});
		$scope.$on('$destroy', function () {
			events.off();
		});

	}

	function checkOrphan(eventId) {
		Event.getName(eventId).once('value', function (snap) {
			if (!snap.exists()) {
				Pilot.removeEvent(FPVSession.user.$id, eventId, function (err) {
					$timeout(function () {
						if (!err) {
							ngToast.warning('Removed Orphan event');
						}
					});
				});
			}
		});
	}

}
MeCtrl.$inject = ['FPVSession', 'RDFDateUtil', 'Pilot', 'Event', 'ngToast', '$timeout', '$scope', '$routeParams'];
