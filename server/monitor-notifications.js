'use strict';
var Queue = require('firebase-queue'),
	Firebase = require('firebase'),
	async = require('async'),
	Slack = require('slack-node'),
	env = require('gulp-env');
env({
	file: '.env.json'
});

var slack = new Slack(process.env.SLACK_API_TOKEN);
var slackQueueRef = new Firebase('https://<FIREBASE_ID>.firebaseio.com/notifications/slack');
var slackQueue = new Queue(slackQueueRef, function (data, progress, resolve, reject) {
	// Read and process task data
	try {
		console.log('got slack data', data);
		progress(50);
		var channels = data.channel.split(',');
		channels.forEach(function (val) {
			slack.api('chat.postMessage', {
				text: data.message,
				channel: val,
				username: 'Race Day FPV - ZA',
				icon_emoji:':checkered_flag:',
				link_names: 1
			}, function (err, response) {
				if (err) {
					console.log('err', err);
					reject();
				} else {
					console.log('response', response);
					if (response.ok) {
						console.log('resolve');
						resolve();
					} else {
						console.log('reject');
						reject();
					}
				}
			});
		});
	} catch (err) {
		console.log('catch', err);
	}
});

console.log('Motitoring Queue at: ' + slackQueueRef.toString());


//var whatsappQueueRef = new Firebase('https://<FIREBASE_ID>.firebaseio.com/notifications/whatsapp');
//var whatsappQueue = new Queue(whatsappQueueRef, function (data, progress, resolve, reject) {
//	// Read and process task data
//	try {
//		var calls = [];
//		console.log('got data', data);
//		progress(50);
//		var toList = '<WHATSAPP_RECIPIENTS>';
//		console.log('recipients:', toList);
//
//		for (var k = 0; k < toList.length; k++) {
//			var to = toList[k];
//			addCall(calls, to, data.message);
//		}
//
//		async.series(calls, function (err, result) {
//			if (err) {
//				console.log('rejecting', err);
//				reject();
//			} else {
//				console.log('resolving', result);
//				resolve();
//			}
//		});
//
//	} catch (err) {
//		console.log('catch', err);
//	}
//});
//
//console.log('Motitoring Queue at: ' + whatsappQueueRef.toString());
//
//
//function addCall(calls, to, message) {
//	console.log('prepare message to: ' + to);
//	calls.push(function (callback) {
//		yowsup(to, message, function (err) {
//			console.log('yo done');
//			if (err) {
//				return callback(err);
//			} else {
//				return callback();
//			}
//		});
//	});
//}
//
//var yowsup = (function () {
//	var exec = require('child_process').exec;
//	var cmd = (function () {
//		var command = "yowsup-cli demos -l " + process.env.WHATSAPP_LOGIN + ":" + process.env.WHATSAPP_PASSWORD + " -s ";
//		return function (to, message) {
//			return command + to + " \"" + message + "\"";
//		};
//	}());
//	return function (to, message, done) {
//		exec(cmd(to, message), function (err, stdout, stderr) {
//			console.log('########## yowsup message to: ' + to + ' ##########');
//			console.log('err', err);
//			console.log('stderr', stderr);
//			console.log('stdout', stdout);
//			try {
//				if (err) {
//					done('error: ' + err);
//					return;
//				}
//				if (stderr) {
//					if (stderr.toUpperCase().indexOf('Message sent'.toUpperCase()) > -1) {
//						done();
//					} else {
//						done('error: ' + stderr);
//					}
//					return;
//				}
//				if (stdout) {
//					if (stdout.toUpperCase().indexOf('Error'.toUpperCase()) > -1) {
//						done('error: ' + stdout);
//					} else {
//						done();
//					}
//				}
//			} finally {
//				console.log('############################');
//			}
//		});
//	};
//}());
