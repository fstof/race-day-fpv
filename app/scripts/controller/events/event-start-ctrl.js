'use strict';

angular.module('race-day-fpv')
	.controller('EventStartCtrl', EventStartCtrl);

function EventStartCtrl(FPVSession, Pilot, Event, RDFDateUtil, ngToast, $routeParams, $timeout, $scope) {
	var self = this;

	var eventId = $routeParams.eventId;

	self.event = {};
	self.groups = {};
	var groupIds = [];

	self.numberOfGroups = 0;
	_init();

	function _init() {
		var ev = Event.get(eventId);

		ev.on('value', function (snap) {
			self.event = snap.val();
			self.event.$id = eventId;
			self.eventDate = RDFDateUtil.stringValue(new Date(self.event.date));
		});
		$scope.$on('$destroy', function () {
			ev.off();
		});

		var grps = Event.getGroups(eventId);
		grps.on('child_added', function (snap) {
			var key = snap.key();
			var val = snap.val();
			self.groups[key] = val;
			groupIds.push(key);
			self.numberOfGroups++;
		});
		grps.on('child_removed', function (snap) {
			var key = snap.key();
			delete self.groups[key];
			groupIds.splice(groupIds.indexOf(key), 1);
			self.numberOfGroups--;
		});
		$scope.$on('$destroy', function () {
			grps.off();
		});
	}

	self.removeGroup = function () {
		Event.deleteGroup(eventId, groupIds[groupIds.length - 1], function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error');
				} else {
					self.shuffle();
				}
			});
		});
	};

	self.addGroup = function () {
		Event.addGroup(eventId, {name: 'Group ' + (groupIds.length + 1)}, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error');
				} else {
					self.shuffle();
				}
			});
		});
	};

	self.shuffle = function () {
		var shuffeled = angular.copy(self.event.pilots);

		var k = 0;
		angular.forEach(shuffeled, function (val, key) {
			console.log('pilot', val, key);
			if (!self.event.groups[groupIds[k]]) {
				k = 0;
			}
			if (!self.event.groups[groupIds[k]].racers) {
				self.event.groups[groupIds[k]].racers = {};
			}
			console.log('adding pilot ' + key + ' to group ' + groupIds[k], val);
			// todo we need to add it to the databse... not just in memory
			self.event.groups[groupIds[k]].racers[key] = val;
			k++;
		});
	};

	self.startEvent = function () {
		var racerCount = 0;
		angular.forEach(self.evRacers, function (val) {
			if (val.checkedIn) {
				racerCount++;
			}
		});
		console.log('racerCount', racerCount);
	};

}
EventStartCtrl.$inject = ['FPVSession', 'Pilot', 'Event', 'RDFDateUtil', 'ngToast', '$routeParams', '$timeout', '$scope'];