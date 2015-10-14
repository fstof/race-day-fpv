'use strict';

angular.module('race-day-fpv')
	.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl(FPVSession, RaceGroup, ngToast) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.groups = {};
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
		var obj = {name: ''};
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
GroupsCtrl.$inject = ['FPVSession', 'RaceGroup', 'ngToast'];
