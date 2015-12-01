'use strict';

angular.module('race-day-fpv')
	.controller('EventStartCtrl', EventStartCtrl);

function EventStartCtrl(Pilot, Event, Frequency, RDFDateUtil, ngToast, $routeParams, $q, $scope, $firebaseArray, $firebaseObject) {
	var self = this;

	var eventId = $routeParams.eventId;

	self.event = {};
	self.groups = {};
	var _pilots = {};
	var _raceFrequencies = {};

	self.numberOfGroups = 0;
	var _numOfPilots = 0;
	_init();

	function _init() {
		var ev = Event.get(eventId);
		ev.on('value', function (snap) {
			self.event = snap.val();
			self.event.$id = eventId;
			self.eventDate = RDFDateUtil.stringValue(new Date(self.event.date));
			angular.forEach(self.event.pilots, function (val, key) {
				if (val.checkedIn) {
					_pilots[key] = val;
					_numOfPilots = Object.keys(_pilots).length;
				}
			});
		});
		$scope.$on('$destroy', function () {
			ev.off();
		});

		var grps = Event.getGroups(eventId);
		self.groups = $firebaseArray(grps);
		self.groups.$loaded(function () {
			self.numberOfGroups = self.groups.length;
		});

		var freq = Frequency.all();
		_raceFrequencies = $firebaseObject(freq);
	}

	self.removeGroup = function () {
		if (self.numberOfGroups == 1) {
			return;
		}
		self.groups.$remove(self.numberOfGroups - 1).then(function () {
			self.numberOfGroups--;
			self.shuffle();
		});
	};

	self.addGroup = function () {
		self.groups.$add({name: 'Group ' + (self.numberOfGroups + 1)}).then(function () {
			self.numberOfGroups++;
			self.shuffle();
		});
	};

	self.shuffle = function () {
		if (_pilots && Object.keys(_pilots).length > 0) {
			var availableFreqs = {};

			for (var c = 0; c < self.groups.length; c++) {
				var groupKey = self.groups[c].$id;
				availableFreqs[groupKey] = {};
				angular.forEach(_raceFrequencies, function (val, key) {
					availableFreqs[groupKey][key] = angular.copy(val);
					availableFreqs[groupKey][key].used = false;
				});
				self.groups[c].racers = null;
				self.groups.$save(c);
			}

			var shuffledKeys = faker.helpers.shuffle(Object.keys(_pilots));
			var theGroupIndex = 0;
			var deferrals = [];
			var promises = [];
			for (var b = 0; b < shuffledKeys.length; b++) {
				deferrals.push($q.defer());
				promises.push(deferrals[b].promise);

				if (!self.groups[theGroupIndex]) {
					theGroupIndex = 0;
				}
				var thePilot = $firebaseObject(Pilot.get(shuffledKeys[b]));
				_extracted(thePilot, theGroupIndex, shuffledKeys[b], deferrals[b]);
				theGroupIndex++;
			}
			$q.all(promises)
				.then(function () {
					console.log('all resolved');
					console.log(self.groups);

					for (var d = 0; d < self.groups.length; d++) {
						var group = self.groups[d];
						var smallest = _getSmallestPilot(group.racers);
						while (smallest != null) {
							_assignFreq(smallest, availableFreqs[group.$id]);
							smallest = _getSmallestPilot(group.racers);
						}
						self.groups.$save(d);
					}
				});
		}
	};

	function _extracted(thePilot, theGroupIndex, rkey, defer) {
		thePilot.$loaded(function () {
			if (!self.groups[theGroupIndex].racers) {
				self.groups[theGroupIndex].racers = {};
			}
			self.groups[theGroupIndex].racers[rkey] = {
				name: thePilot.name,
				alias: thePilot.alias,
				avatar: thePilot.avatar,
				frequencies: thePilot.frequencies ? thePilot.frequencies : null
			};
			defer.resolve();
		});
	}

	function _assignFreq(pilot, availableFreqs) {
		if (pilot.frequencies != null) {
			var freq = _getCommonFreq(pilot.frequencies, availableFreqs);
			if (freq != null) {
				if (!freq.used) {
					freq.used = true;
					pilot.raceFrequency = freq;
				} else {
					freq.frequency += ' - DUPE';
					pilot.raceFrequency = freq;
				}
			} else {
				pilot.raceFrequency = {frequency: 'ERROR'};
			}
		} else {
			pilot.raceFrequency = {frequency: 'UNKNOWN'};
		}
		return pilot;
	}

	function _getCommonFreq(obj1, obj2) {
		var arr1 = Object.keys(obj1);
		var arr2 = Object.keys(obj2);
		var fallback = null;

		for (var k = 0; k < arr1.length; k++) {
			for (var l = 0; l < arr2.length; l++) {
				var freq = obj2[arr2[l]];
				if (arr1[k] == arr2[l]) {
					if (!freq.used) {
						return freq;
					} else {
						fallback = freq;
					}
				}
			}
		}
		return fallback;
	}

	function _getSmallestPilot(pilots) {
		var smallest = null;
		var smallestIx = -1;
		var smallestNum = 999;

		var keys = Object.keys(pilots);

		for (var k = 0; k < keys.length; k++) {
			var p = pilots[keys[k]];
			if (p.frequencies) {
				var numFreq = Object.keys(p.frequencies).length;
				if (numFreq < smallestNum && !p.raceFrequency) {
					smallestNum = numFreq;
					smallest = p;
					smallestIx = k;
				}
			} else {
				if (!p.raceFrequency) {
					smallestNum = 0;
					smallest = p;
					smallestIx = k;
				}
			}
		}
		return smallest;
	}

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
EventStartCtrl.$inject = ['Pilot', 'Event', 'Frequency', 'RDFDateUtil', 'ngToast', '$routeParams', '$q', '$scope', '$firebaseArray', '$firebaseObject'];
