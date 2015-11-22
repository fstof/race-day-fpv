'use strict';

angular.module('race-day-fpv')
	.controller('EventStartCtrl', EventStartCtrl);

function EventStartCtrl(FPVSession, Pilot, Event, Frequency, RDFDateUtil, ngToast, $routeParams, $timeout, $q, $scope, $firebaseArray, $firebaseObject) {
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
					Pilot.get(key).once('value', function (snap) {
						var p = snap.val();
						var v = {
							key: snap.key(),
							name: p.name,
							alias: p.alias,
							avatar: p.avatar,
							frequencies: p.frequencies ? p.frequencies : null
						};
						_pilots[snap.key()] = v;
						_numOfPilots = Object.keys(_pilots).length;
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

	function _assignFreq(pilot, availableFreqs, group) {
		if (pilot.frequencies != null) {
			var freq = _getCommonFreq(pilot.frequencies, availableFreqs[group]);
			if (freq != null) {
				delete availableFreqs[group][freq.key];
				pilot.raceFrequency = freq;
			}
		}
		return pilot;
	}

	self.shuffle = function () {
		if (_pilots && Object.keys(_pilots).length > 0) {
			var availableFreqs = {};

			angular.forEach(self.groups, function (val, key) {
				availableFreqs[key] = angular.copy(_raceFrequencies);
				Event.deleteAllGroupRacers(eventId, key, function (err) {
					if (err) {
						ngToast.warning(err);
					}
				});
			});

			var shuffledKeys = faker.helpers.shuffle(Object.keys(_pilots));
			var savePromises = [];
			var saveDefers = [];
			var k = 1;
			for (var b = 0; b < shuffledKeys.length; b++) {
				var defer = $q.defer();
				saveDefers.push(defer);
				savePromises.push(defer.promise);
				var theGroupKey = 'Group ' + k;
				if (!self.groups['Group ' + k]) {
					k = 1;
					theGroupKey = 'Group ' + k
				}
				var thePilot = _pilots[shuffledKeys[b]];

				var pilot = _assignFreq(thePilot, availableFreqs, theGroupKey);
				_persistIt(theGroupKey, shuffledKeys, pilot, saveDefers, b);
				k++;
			}
			$q.all(savePromises)
				.then(function () {
					console.log('all resolved');
					console.log(self.groups);
				});
			//var pCopy = angular.copy(_pilots);
			//var thePilot = _smallestPilot(pCopy);
		}
	};

	function _persistIt(theGroupKey, shuffledKeys, pilot, promises, b) {
		Event.addGroupRacer(eventId, theGroupKey, shuffledKeys[b], pilot, function (err) {
			if (err) {
				ngToast.warning(err);
			}
			promises[b].resolve();
		});
	}

	function _getCommonFreq(obj1, obj2) {
		var arr1 = Object.keys(obj1);
		var arr2 = Object.keys(obj2);

		for (var k = 0; k < arr1.length; k++) {
			for (var l = 0; l < arr2.length; l++) {
				if (arr1[k] == arr2[l]) {
					return obj2[arr2[k]];
				}
			}
		}
		return null;
	}

	function _smallestPilot(pilots) {
		var arr = Object.keys(pilots);
		var smallest = null;
		var smallestNum = 999;

		for (var k = 0; k < arr.length; k++) {
			var p = pilots[arr[k]];
			var numFreq = Object.keys(p.frequencies).length;
			if (numFreq < smallestNum) {
				smallestNum = numFreq;
				smallest = p;
			}
		}
		delete pilots[smallest.key];
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
EventStartCtrl.$inject = ['FPVSession', 'Pilot', 'Event', 'Frequency', 'RDFDateUtil', 'ngToast', '$routeParams', '$timeout', '$q', '$scope', '$firebaseArray', '$firebaseObject'];
