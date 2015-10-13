'use strict';

angular.module('race-day-fpv')
	.controller('ManageCtrl', ManageCtrl);

function ManageCtrl(FPVSession, RaceGroup, Frequency, ngToast) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.groups = {};
	self.frequencies = {};
	_init();

	function _init() {
		//self.groups = RaceGroup.all;
		var allGrp = RaceGroup.all();
		allGrp.on('child_added', function (snap) {
			self.groups[snap.key()] = snap.val();
			self.groups[snap.key()].key = snap.key();

		});
		allGrp.on('child_removed', function (snap) {
			delete self.groups[snap.key()];
		});

		var allFreq = Frequency.all();
		allFreq.on('child_added', function (snap) {
			self.frequencies[snap.key()] = snap.val();
			self.frequencies[snap.key()].key = snap.key();

		});
		allFreq.on('child_removed', function (snap) {
			delete self.frequencies[snap.key()];
		});
	}

	self.updateGroup = function (group) {
		RaceGroup.save(group.key, group, function (err) {
			if (err) {
				ngToast.danger('Group not saved');
			} else {
				ngToast.success('Group saved');
			}
		});
	};

	self.addGroup = function () {
		var obj = {name: 'Group'};
		RaceGroup.create(obj, function (err) {
			if (err) {
				ngToast.danger('Group not added');
			} else {
				ngToast.success('Group added');
			}
		});
	};

	self.deleteGroup = function (group) {
		RaceGroup.delete(group.key, function (err) {
			if (err) {
				ngToast.danger('Group not deleted');
			} else {
				ngToast.success('Group deleted');
			}
		});
	};

	self.updateFreq = function (freq) {
		Frequency.save(freq.key, freq, function (err) {
			if (err) {
				ngToast.danger('Frequency not saved');
			} else {
				ngToast.success('Frequency saved');
			}
		});
	};

	self.addFreq = function () {
		var obj = {
			description: 'Fat1, F1',
			frequency: '5740'
		};
		Frequency.create(obj, function (err) {
			if (err) {
				ngToast.danger('Frequency not added');
			} else {
				ngToast.success('Frequency added');
			}
		});
	};

	self.deleteFreq = function (freq) {
		Frequency.delete(freq.key, function (err) {
			if (err) {
				ngToast.danger('Frequency not deleted');
			} else {
				ngToast.success('Frequency deleted');
			}
		});
	};
}
ManageCtrl.$inject = ['FPVSession', 'RaceGroup', 'Frequency', 'ngToast'];
