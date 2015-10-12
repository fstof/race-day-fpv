'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(FPVSession, UserService, EventService) {
	var self = this;

	self.events = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			_loadMyEvents();
		}
	}

	function _loadMyEvents() {
		UserService.getEvents(FPVSession.user.$id)
			.then(function (result) {
				self.events = result.data;
				angular.forEach(self.events, function (val, key) {
					EventService.get(key)
						.then(function (result) {
							self.events[key] = result.data;
							self.events[key].$id = key;
						})
				});
			});
	}
}
HomeCtrl.$inject = ['FPVSession', 'UserService', 'EventService'];
