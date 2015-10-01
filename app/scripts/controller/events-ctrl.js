'use strict';

angular.module('race-day-fpv')
	.controller('EventsCtrl', EventsCtrl);

function EventsCtrl($firebaseArray, $firebaseObject) {
	// now we can use $firebase to synchronize data between clients and the server!
	var ref = new Firebase('https://race-day-fpv.firebaseio.com');
	var self = this;

	self.events = {};
	_init();

	function _init() {
		var listRef = ref.child('events');
		self.events = $firebaseArray(listRef);
		self.events.forEach(function (elem) {
			elem.organiser = _getUser(elem.organiser);
		})
	}

	function _getUser(uid) {
		var userRef = ref.child('users/' + uid);
		return $firebaseObject(userRef);
	}
}
EventsCtrl.$inject = ['$firebaseArray', '$firebaseObject'];
