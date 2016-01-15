'use strict';

angular.module('race-day-fpv')
	.factory('Notification', Notification);

function Notification(FIREBASE_REF, RDFDateUtil, $location) {
	var ref = FIREBASE_REF;

	return {
		create: function (notice, callback) {
			return ref.child('notifications/whatsapp/tasks').push(notice, callback);
		},
		notifyNewEvent: function (event, callback) {
			var notice = {
				message: '\ud83c\udfc1 Race Day FPV - New event \ud83c\udfc1\n\n' +
				'Name: ' + event.name + '\n' +
				'Date: ' + RDFDateUtil.stringValue(event.date) + '\n' +
				'Time: ' + RDFDateUtil.stringTimeValue(event.date) + '\n' +
				'Venue: ' + event.venue + '\n' +
				'Pindrop: ' + event.map + '\n\n' +
				'To see more details on this event or to join, register here:\n' + $location.absUrl()
			};
			return ref.child('notifications/whatsapp/tasks').push(notice, function () {
				notice.channel = '#events';
				ref.child('notifications/slack/tasks').push(notice, callback);
			});
		},
		notifyEventUpdate: function (event, callback) {
			var notice = {
				message: '\ud83c\udfc1 Race Day FPV - Event Update \ud83c\udfc1\n\n' +
				'Name: ' + event.name + '\n' +
				'Date: ' + RDFDateUtil.stringValue(event.date) + '\n' +
				'Time: ' + RDFDateUtil.stringTimeValue(event.date) + '\n' +
				'Venue: ' + event.venue + '\n' +
				'Pindrop: ' + event.map + '\n\n' +
				'To see more details on this event or to join, register here:\n' + $location.absUrl()
			};
			return ref.child('notifications/whatsapp/tasks').push(notice, function () {
				notice.channel = '#events';
				ref.child('notifications/slack/tasks').push(notice, callback);
			});
		},
		notifyEventJoined: function (event, racers, newGuy, callback) {
			var flying = '';
			for (var k = 0; k < racers.length; k++) {
				flying += racers[k].name + '\n'
			}

			var notice = {
				message: '\ud83c\udfc1 Race Day FPV - ' + newGuy + ' Joined \ud83c\udfc1\n\n' +
				'Name: ' + event.name + '\n' +
				'Date: ' + RDFDateUtil.stringValue(event.date) + '\n' +
				'Time: ' + RDFDateUtil.stringTimeValue(event.date) + '\n' +
				'Venue: ' + event.venue + '\n' +
				'Pindrop: ' + event.map + '\n\n' +
				'Flying:\n' + flying + '\n' +
				'To see more details on this event or to join, register here:\n' + $location.absUrl()
			};
			return ref.child('notifications/whatsapp/tasks').push(notice, function () {
				notice.channel = '#events';
				ref.child('notifications/slack/tasks').push(notice, callback);
			});
		}
	};
}

Notification.$inject = ['FIREBASE_REF', 'RDFDateUtil', '$location'];
