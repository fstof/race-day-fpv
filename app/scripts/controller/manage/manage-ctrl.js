'use strict';

angular.module('race-day-fpv')
	.controller('ManageCtrl', ManageCtrl);

function ManageCtrl(FPVSession, RaceGroup, ngToast) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.groups = {};
	_init();

	function _init() {
		//self.groups = RaceGroup.all;
		var all = RaceGroup.all();
		all.on('child_added', function (snap) {
			self.groups[snap.key()] = snap.val();
			self.groups[snap.key()].key = snap.key();

		});
		all.on('child_removed', function (snap) {
			delete self.groups[snap.key()];
		});
	}

	self.update = function (group) {
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
}
ManageCtrl.$inject = ['FPVSession', 'RaceGroup', 'ngToast'];
