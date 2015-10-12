'use strict';

angular.module('race-day-fpv')
	.factory('RaceGroup', RaceGroup);

function RaceGroup(FIREBASE_REF, $firebaseArray) {
	var ref = FIREBASE_REF;

	var raceGroups = $firebaseArray(ref.child('raceGroups').orderByChild('name'));

	return {
		//all: raceGroups,
		all: function () {
			return ref.child('raceGroups').orderByChild('name');
		},
		get: function (id) {
			return ref.child('raceGroups').child(id);
		},
		create: function (group, callback) {
			return ref.child('raceGroups').push(group, callback);
		},
		delete: function (groupId, callback) {
			return ref.child('raceGroups/' + groupId).set(null, callback);
		},
		save: function (groupId, group, callback) {
			return ref.child('raceGroups/' + groupId).set(group, callback);
		}
	};
}

RaceGroup.$inject = ['FIREBASE_REF', '$firebaseArray'];
