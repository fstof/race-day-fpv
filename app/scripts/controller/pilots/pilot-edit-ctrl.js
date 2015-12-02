'use strict';

angular.module('race-day-fpv')
	.controller('PilotEditCtrl', PilotEditCtrl);

function PilotEditCtrl(FPVSession, Pilot, Frequency, ngToast, $routeParams, $location, $timeout, $scope) {
	var self = this;
	self.status = {
		details: {
			open: false
		},
		frequencies: {
			open: false
		}
	};
	self.pilot = {};
	var userId = $routeParams.userId || FPVSession.user.$id;

	self.allFrequencies = {};
	self.myFrequencies = {};
	self.freqCount = 0;

	_init();

	function _init() {
		var pi = Pilot.get(userId);

		pi.on('value', function (snap) {
			self.pilot = snap.val();
		});
		$scope.$on('$destroy', function () {
			pi.off();
		});

		var allFreq = Frequency.all();
		allFreq.on('value', function (snap) {
			self.allFrequencies = snap.val();
			var myFreq = Pilot.getFrequencies(userId);
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
	}

	self.saveUserDetails = function () {
		Pilot.update(userId, self.pilot, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.danger('Error');
				} else {
					ngToast.success('Saved');
				}
			});
		});
	};

	self.addFreq = function (freq) {
		freq = angular.copy(freq);
		freq.vtx = freq.vtx || '';
		freq.vrx = freq.vrx || '';
		delete freq.frequency;
		delete freq.$id;
		Pilot.addFrequency(userId, freq.key, freq, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error');
				} else {
					ngToast.success('Success');
				}
			});
		});
	};

	self.deleteFreq = function (freq) {
		Pilot.removeFrequency(userId, freq.key, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error');
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
		Pilot.updateFrequency(userId, upd.key, upd, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error');
				} else {
					ngToast.success('Success');
				}
			});
		});
	};
}
PilotEditCtrl.$inject = ['FPVSession', 'Pilot', 'Frequency', 'ngToast', '$routeParams', '$location', '$timeout', '$scope'];
