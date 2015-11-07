'use strict';

angular.module('race-day-fpv')
	.controller('EventStartCtrl', EventStartCtrl);

function EventStartCtrl(FPVSession, Pilot, Event, RDFDateUtil, ngToast, $routeParams, $timeout, $scope) {
	var self = this;

	var eventId = $routeParams.eventId;

	self.event = {};
	self.groups = {};
	var pilots = {};

	self.numberOfGroups = 0;
	var numOfPilots = 0;
	_init();

	function _init() {
		var ev = Event.get(eventId);

		ev.on('value', function (snap) {
			self.event = snap.val();
			self.event.$id = eventId;
			self.eventDate = RDFDateUtil.stringValue(new Date(self.event.date));
			angular.forEach(self.event.pilots, function (val, key) {
				Pilot.get(key).once('value', function (snap) {
					pilots[snap.key()] = snap.val();
					numOfPilots = Object.keys(pilots).length;
				});
			});
		});
		$scope.$on('$destroy', function () {
			ev.off();
		});

		var grps = Event.getGroups(eventId);
		grps.on('child_added', function (snap) {
			var key = snap.key();
			var val = snap.val();
			self.groups[key] = val;
			self.numberOfGroups++;
		});
		grps.on('child_removed', function (snap) {
			var key = snap.key();
			delete self.groups[key];
			self.numberOfGroups--;
		});
		$scope.$on('$destroy', function () {
			grps.off();
		});
	}

	self.removeGroup = function () {
		Event.deleteGroup(eventId, 'Group ' + self.numberOfGroups, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.warning('Error: ' + err);
				} else {
					self.shuffle();
				}
			});
		});
	};

	self.addGroup = function () {
		Event.addGroup(eventId, {name: 'Group ' + (self.numberOfGroups + 1)}, function (err) {
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
		var shuffled = angular.copy(pilots);

		//var i, j, temparray, chunk = 10;
		//for (i = 0, j = array.length; i < j; i += chunk) {
		//	temparray = array.slice(i, i + chunk);
		//	// do whatever
		//}

		angular.forEach(self.groups, function (val, key) {
			//val.racers = {};
			Event.deleteAllGroupRacers(eventId, key, function (err) {
				console.log('deleted racers from group', key);
				$timeout(function () {
					if (err) {
						ngToast.warning(err);
					}
				});
			});
		});

		var k = 1;
		angular.forEach(shuffled, function (val, key) {
			if (!self.groups['Group ' + k]) {
				k = 1;
			}
			console.log('adding pilot ' + key + ' to Group ' + k, val);
			//self.groups['Group ' + k].racers[key] = val;
			Event.addGroupRacer(eventId, 'Group ' + k, key, val, function (err) {
				$timeout(function () {
					if (err) {
						ngToast.warning(err);
					}
				});
			});
			k++;
		});
		//angular.forEach(self.groups, function (val, key) {
		//	Event.deleteGroup(eventId, key, function (err) {
		//		Event.updateGroup(eventId, key, val, function (err) {
		//			if (err) {
		//				$timeout(function () {
		//					ngToast.warning(err);
		//				});
		//			}
		//		});
		//	});
		//});
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
