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
		self.event = $firebaseObject(ev);
		self.event.$loaded(function () {
			_numOfPilots = Object.keys(self.event.pilots).length;
			_pilots = self.event.pilots;
		});
		//ev.on('value', function (snap) {
		//	self.event = snap.val();
		//	self.event.$id = eventId;
		//	self.eventDate = RDFDateUtil.stringValue(new Date(self.event.date));
		//	angular.forEach(self.event.pilots, function (val, key) {
		//		if (val.checkedIn) {
		//			Pilot.get(key).once('value', function (snap) {
		//				var p = snap.val();
		//				var v = {
		//					key: snap.key(),
		//					name: p.name,
		//					alias: p.alias,
		//					avatar: p.avatar,
		//					frequencies: p.frequencies ? p.frequencies : null
		//				};
		//				_pilots[snap.key()] = v;
		//				_numOfPilots = Object.keys(_pilots).length;
		//			});
		//		}
		//	});
		//});
		//$scope.$on('$destroy', function () {
		//	ev.off();
		//});

		var grps = Event.getGroups(eventId);
		self.groups = $firebaseArray(grps);
		self.groups.$loaded(function () {
			self.numberOfGroups = self.groups.length;
		});

		var freq = Frequency.all();
		_raceFrequencies = $firebaseArray(freq);
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
				var key = self.groups[c].$id;
				availableFreqs[key] = angular.copy(_raceFrequencies);
				self.groups[c].racers = null;
				self.groups.$save(c);
			}

			var shuffledKeys = faker.helpers.shuffle(Object.keys(_pilots));
			var k = 0;
			for (var b = 0; b < shuffledKeys.length; b++) {
				var theGroupIndex = k;
				if (!self.groups[k]) {
					k = 0;
					theGroupIndex = k
				}
				var thePilot = $firebaseObject(Pilot.get(shuffledKeys[b]));
				_extracted(thePilot, theGroupIndex, shuffledKeys[b]);
				k++;
			}
			//for (var d = 0; d < self.groups.length; d++) {
			//	self.groups.$save(d);
			//}
			//var pCopy = angular.copy(_pilots);
			//var thePilot = _smallestPilot(pCopy);
		}
	};

	function _extracted(thePilot, theGroupIndex, rkey) {
		thePilot.$loaded(function () {
			if (!self.groups[theGroupIndex].racers) {
				self.groups[theGroupIndex].racers = {};
			}
			var v = {
				name: thePilot.name,
				alias: thePilot.alias,
				avatar: thePilot.avatar,
				frequencies: thePilot.frequencies ? thePilot.frequencies : null
			};
			self.groups[theGroupIndex].racers[rkey] = v;
			self.groups.$save(theGroupIndex);
		});
	}

	function _getThePilot(key) {
		retPilot.get(key)
	}

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
