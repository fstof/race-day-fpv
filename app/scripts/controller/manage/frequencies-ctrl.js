'use strict';

angular.module('race-day-fpv')
	.controller('FrequenciesCtrl', FrequenciesCtrl);

function FrequenciesCtrl(FPVSession, Frequency, ngToast, $timeout, $scope) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.frequencies = {};
	_init();

	function _init() {
		var allFreq = Frequency.all();
		allFreq.on('child_added', function (snap) {
			$timeout(function () {
				self.frequencies[snap.key()] = snap.val();
				self.frequencies[snap.key()].key = snap.key();
			});
		});
		allFreq.on('child_removed', function (snap) {
			delete self.frequencies[snap.key()];
		});
		$scope.$on('$destroy', function () {
			allFreq.off();
		});
	}

	self.updateFreq = function (freq) {
		Frequency.save(freq.key, freq, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.danger('Frequency not saved');
				} else {
					ngToast.success('Frequency saved');
				}
			});
		});
	};

	self.addFreq = function () {
		var obj = {
			frequency: 0
		};
		Frequency.create(obj, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.danger('Frequency not added');
				} else {
					ngToast.success('Frequency added');
				}
			});
		});
	};

	self.deleteFreq = function (freq) {
		Frequency.delete(freq.key, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.danger('Frequency not deleted');
				} else {
					ngToast.success('Frequency deleted');
				}
			});
		});
	};
}
FrequenciesCtrl.$inject = ['FPVSession', 'Frequency', 'ngToast', '$timeout', '$scope'];
