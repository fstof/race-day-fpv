'use strict';

angular.module('race-day-fpv')
	.controller('EventStartCtrl', EventStartCtrl);

function EventStartCtrl(FPVSession, Pilot, Event, Frequency, RDFDateUtil, ngToast, $routeParams, $timeout, $scope) {
	var self = this;

	var eventId = $routeParams.eventId;

	self.event = {};
	self.groups = {};
	var pilots = {};
	var _raceFrequencies = {};

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
				if (val.checkedIn) {
					Pilot.get(key).once('value', function (snap) {
						pilots[snap.key()] = snap.val();
						numOfPilots = Object.keys(pilots).length;
					});
				}
			});
		});
		$scope.$on('$destroy', function () {
			ev.off();
		});

		var grps = Event.getGroups(eventId);
		grps.on('value', function (snap) {
			if (snap.val()) {
				self.groups = snap.val();
				self.numberOfGroups = Object.keys(self.groups).length;
			}
		});
		$scope.$on('$destroy', function () {
			grps.off();
		});

		var freq = Frequency.all();
		freq.on('value', function (snap) {
			if (snap.val()) {
				_raceFrequencies = snap.val();
			}
		});
		$scope.$on('$destroy', function () {
			freq.off();
		});
	}

	self.removeGroup = function () {
		if (self.numberOfGroups == 1) {
			return;
		}
		Event.deleteGroup(eventId, 'Group ' + self.numberOfGroups, function (err) {
			if (err) {
				ngToast.warning('Error: ' + err);
			} else {
				self.shuffle();
			}
		});
	};

	self.addGroup = function () {
		Event.addGroup(eventId, {name: 'Group ' + (self.numberOfGroups + 1)}, function (err) {
			if (err) {
				ngToast.warning('Error');
			} else {
				self.shuffle();
			}
		});
	};

	self.shuffle = function () {
		if (pilots && Object.keys(pilots).length > 0) {
			var availableFreqs = {};

			angular.forEach(self.groups, function (val, key) {
				Event.deleteAllGroupRacers(eventId, key, function (err) {
					console.log('deleted racers from group', key);
					availableFreqs[key] = angular.copy(_raceFrequencies);
					if (err) {
						ngToast.warning(err);
					}
				});
			});

			var shuffledKeys = faker.helpers.shuffle(Object.keys(pilots));
			var k = 1;
			for (var b = 0; b < shuffledKeys.length; b++) {
				if (!self.groups['Group ' + k]) {
					k = 1;
				}
				var pilot = pilots[shuffledKeys[b]];
				if (pilot.frequencies != null) {
					console.log('Group ' + k, availableFreqs['Group ' + k], pilot.frequencies);
				}
				Event.addGroupRacer(eventId, 'Group ' + k, shuffledKeys[b], pilot, function (err) {
					if (err) {
						ngToast.warning(err);
					}
				});
				k++;
			}
		}
	};

	self.startEvent = function () {
		var racerCount = 0;
		angular.forEach(self.evRacers, function (val) {
			if (val.checkedIn) {
				racerCount++;
			}
		});
		console.log('racerCount', racerCount);
		ngToast.success('yay!!!');
	};

}
EventStartCtrl.$inject = ['FPVSession', 'Pilot', 'Event', 'Frequency', 'RDFDateUtil', 'ngToast', '$routeParams', '$timeout', '$scope'];
