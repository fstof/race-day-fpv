'use strict';

angular.module('race-day-fpv')
	.controller('MeCtrl', MeCtrl);

function MeCtrl(FPVSession, RDFDateUtil, Pilot, Event, Frequency, ngToast, $location, $timeout, $scope) {
	var self = this;

	self.eventCount = 0;
	self.myEvents = {};

	self.allFrequencies = {};
	self.myFrequencies = {};
	self.freqCount = 0;

	self.aircraftCount = 0;
	self.myAircraft = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {

			var events = Pilot.getEvents(FPVSession.user.$id);
			events.on('child_added', function (snap) {
				var key = snap.key();
				var val = {val: snap.val()};
				var ev = Event.get(key);
				ev.once('value', function (snap) {
					if (RDFDateUtil.startOfDate(new Date(snap.val().date)).getTime() >= RDFDateUtil.todayDateTime()) {
						val.$id = key;
						self.myEvents[key] = val;
						self.eventCount++;
					}
				});
				checkOrphan(key);
			});
			events.on('child_removed', function (snap) {
				delete self.myEvents[snap.key()];
				self.eventCount--;
			});
			$scope.$on('$destroy', function () {
				events.off();
			});

			var allFreq = Frequency.all();
			allFreq.on('value', function (snap) {
				self.allFrequencies = snap.val();
				var myFreq = Pilot.getFrequencies(FPVSession.user.$id);
				myFreq.on('child_added', function (snap) {
					var key = snap.key();
					var val = snap.val();
					val.$id = key;
					self.myFrequencies[key] = val;
					self.freqCount++;
					Frequency.get(key).once('value', function (snap) {
						$timeout(function () {
							self.myFrequencies[key].frequency = snap.val().frequency;
						});
					});
					delete self.allFrequencies[key];
				});
				myFreq.on('child_removed', function (snap) {
					delete self.myFrequencies[snap.key()];
					self.freqCount--;
				});
				$scope.$on('$destroy', function () {
					myFreq.off();
				});
			});
			$scope.$on('$destroy', function () {
				allFreq.off();
			});


		} else {
			$location.path('/');
		}
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

	self.addFreq = function (freq) {
		freq = angular.copy(freq);
		freq.vtx = freq.vtx || '';
		freq.vrx = freq.vrx || '';
		delete freq.frequency;
		delete freq.$id;
		Pilot.addFrequency(FPVSession.user.$id, freq.key, freq, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error')
				} else {
					ngToast.success('Success');
				}
			});
		});
	};

	self.deleteFreq = function (freq) {
		Pilot.removeFrequency(FPVSession.user.$id, freq.key, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error')
				} else {
					ngToast.success('Success');
				}
			});
		});
	};


	self.updateFreq = function (freq) {
		var upd = angular.copy(freq);
		upd.vtx = upd.vtx || '';
		upd.vrx = upd.vrx || '';
		delete upd.frequency;
		delete upd.$id;
		Pilot.updateFrequency(FPVSession.user.$id, upd.key, upd, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error')
				} else {
					ngToast.success('Success');
				}
			});
		});
	};
}
MeCtrl.$inject = ['FPVSession', 'RDFDateUtil', 'Pilot', 'Event', 'Frequency', 'ngToast', '$location', '$timeout', '$scope'];
