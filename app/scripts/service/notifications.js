'use strict';

angular.module('race-day-fpv')
	.factory('Notification', Notification);

function Notification(FIREBASE_REF) {
	var ref = FIREBASE_REF;

	return {
		create: function (event, callback) {
			return ref.child('notifications/whatsapp/tasks').push(event, callback);
		}
	};
}

Notification.$inject = ['FIREBASE_REF'];
