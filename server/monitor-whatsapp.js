'use strict';
var config = require('./config/config'),
	Queue = require('firebase-queue'),
	Firebase = require('firebase');

var yowsup = (function () {
	var exec = require('child_process').exec,
		cmd = (function () {
			var command = "yowsup-cli demos -l " + config.yowsup.login + ":" + config.yowsup.password + " -s ";
			return function (to, message) {
				return command + to + " \"" + message + "\"";
			};
		}());
	return function (to, message, done) {
		exec(cmd(to, message), function (err, stdout, stderr) {
			console.log('err', err);
			console.log('stderr', stderr);
			console.log('stdout', stdout);

			if (err) {
				done('error: ' + err);
				return;
			}
			if (stderr) {
				if (stderr.toUpperCase().indexOf('Message sent'.toUpperCase()) > -1) {
					done();
				} else {
					done('error: ' + stderr);
				}
				return;
			}
			if (stdout) {
				if (stdout.toUpperCase().indexOf('Error'.toUpperCase()) > -1) {
					done('error: ' + stdout);
				} else {
					done();
				}
			}
		});
	};
}());


var queueRef = new Firebase('https://race-day-fpv-dev.firebaseio.com/notifications/whatsapp');
var queue = new Queue(queueRef, function (data, progress, resolve, reject) {
	// Read and process task data
	try {
		console.log('got data', data);

		progress(50);

		yowsup(data.to, data.message, function (err) {
			if (err) {
				console.log('rejecting', err);
				reject();
			} else {
				console.log('done');
				resolve();
			}
		});
	} catch (err) {
		console.log('catch', err);
	}
});

//var ref = new Firebase('https://race-day-fpv-dev.firebaseio.com/notifications/whatsapp/tasks');
//ref.push({
//	'to': '27825704688',
//	'message': 'hello firebase'
//});
