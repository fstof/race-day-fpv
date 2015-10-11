'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(FPVSession, User, Event, ngToast) {
	var self = this;

	self.events = {};
	self.myevents = {};
	_init();

	function _init() {
		if (FPVSession.user !== null) {
			self.events = User.getEvents(FPVSession.user.$id);

			self.events.$watch(function (event) {
				console.log(event);
				if (event.event === 'child_added') {
					var ev = Event.get(event.key);
					console.log(ev);
					ev.$loaded(function (addedEvent) {
						if (addedEvent.name) {
							console.log(addedEvent);
							self.myevents[addedEvent.$id] = addedEvent;
						} else { // orphan event now deleting
							User.removeEvent(FPVSession.user.$id, addedEvent.$id)
								.then(function () {
									ngToast.success('Removed an orphaned event');
								});
						}
					});
				} else if (event.event === 'child_removed') {
					delete self.myevents[event.key];
				}
			});
		}
	}

	//function _init() {
	//	if (FPVSession.user !== null) {
	//		var myEventsRef = _ref.child('users/' + FPVSession.user.$id + '/events');
	//
	//		myEventsRef.on('child_added', function (child) {
	//			EventService.get(child.key())
	//				.then(function (result) {
	//					if (result.data === null) {
	//						$firebaseObject(myEventsRef.child(child.key())).$remove();
	//					} else {
	//						self.events[child.key()] = result.data;
	//						self.events[child.key()].$id = child.key();
	//					}
	//				});
	//		});
	//	}
	//}
}
HomeCtrl.$inject = ['FPVSession', 'User', 'Event', 'ngToast'];
