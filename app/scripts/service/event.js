'use strict';

angular.module('race-day-fpv')
	.factory('Event', Event);

function Event(FIREBASE_REF, RDFDateUtil, $firebaseObject, $firebaseArray) {
	var ref = FIREBASE_REF;
	var events = $firebaseArray(ref.child('events').orderByChild('date'));

	return {
		all: events,
		allUpcomming: $firebaseArray(ref.child('events').orderByChild('date').startAt(RDFDateUtil.todayDateTime())),
		allPast: $firebaseArray(ref.child('events').orderByChild('date').endAt(RDFDateUtil.todayDateTime())),
		get: function (id) {
			return ref.child('events').child(id);
		},
		getName: function (id) {
			return ref.child('events').child(id).child('name');
		},
		create: function (event, callback) {
			return ref.child('events').push(event, callback);
		},
		update: function (eventId, event, callback) {
			return ref.child('events/' + eventId).update(event, callback);
		},
		delete: function (eventId, callback) {
			return ref.child('events/' + eventId).set(null, callback);
		},
		getRacers: function (eventId) {
			return $firebaseArray(ref.child('events').child(eventId).child('pilots'));
		},
		getRacer: function (eventId, racerId) {
			return ref.child('events').child(eventId).child('pilots').child(racerId);
		},
		addRacer: function (eventId, racerId, racer, callback) {
			return ref.child('events').child(eventId).child('pilots').child(racerId).set(racer, callback);
		},
		updateRacer: function (eventId, racerId, racer, callback) {
			return ref.child('events').child(eventId).child('pilots').child(racerId).update(racer, callback);
		},
		removeRacer: function (eventId, racerId, callback) {
			return ref.child('events').child(eventId).child('pilots').child(racerId).set(null, callback);
		},
		getGroups: function (eventId) {
			return ref.child('events').child(eventId).child('groups');
		},
		addGroup: function (eventId, group, callback) {
			return ref.child('events').child(eventId).child('groups').child(group.name).set(group, callback);
		},
		updateGroup: function (eventId, groupId, group, callback) {
			return ref.child('events').child(eventId).child('groups').child(groupId).set(group, callback);
		},
		deleteGroup: function (eventId, groupId, callback) {
			return ref.child('events').child(eventId).child('groups').child(groupId).set(null, callback);
		},
		addGroupRacer: function (eventId, groupId, racerId, racer, callback) {
			return ref.child('events').child(eventId).child('groups').child(groupId).child('racers').child(racerId).set(racer, callback);
		},
		deleteGroupRacer: function (eventId, groupId, racerId, callback) {
			return ref.child('events').child(eventId).child('groups').child(groupId).child('racers').child(racerId).set(null, callback);
		},
		deleteAllGroupRacers: function (eventId, groupId, callback) {
			return ref.child('events').child(eventId).child('groups').child(groupId).child('racers').set(null, callback);
		}
	};
}

Event.$inject = ['FIREBASE_REF', 'RDFDateUtil', '$firebaseObject', '$firebaseArray'];
