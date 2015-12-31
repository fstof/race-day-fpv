'use strict';
var Queue = require('firebase-queue'),
	Firebase = require('firebase'),
	async = require('async'),
	env = require('gulp-env');
env({
	file: '.env.json'
});


var queueRef = new Firebase('https://<FIREBASE_ID>.firebaseio.com/notifications/whatsapp');
var queue = new Queue(queueRef, function (data, progress, resolve, reject) {
	// Read and process task data
	try {
		var calls = [];
		console.log('got data', data);
		progress(50);
		var toList = '<WHATSAPP_RECIPIENTS>';
		console.log('recipients:', toList);

		for (var k = 0; k < toList.length; k++) {
			var to = toList[k];
			addCall(calls, to, data.message);
		}

		async.series(calls, function (err, result) {
			if (err) {
				console.log('rejecting', err);
				reject();
			} else {
				console.log('resolving', result);
				resolve();
			}
		});

	} catch (err) {
		console.log('catch', err);
	}
});

console.log('Motitoring Queue at: ' + queueRef.toString());


function addCall(calls, to, message) {
	console.log('prepare message to: ' + to);
	calls.push(function (callback) {
		yowsup(to, message, function (err) {
			console.log('yo done');
			if (err) {
				return callback(err);
			} else {
				return callback();
			}
		});
	});
}

var yowsup = (function () {
	var exec = require('child_process').exec;
	var cmd = (function () {
		var command = "yowsup-cli demos -l " + process.env.WHATSAPP_LOGIN + ":" + process.env.WHATSAPP_PASSWORD + " -s ";
		return function (to, message) {
			return command + to + " \"" + message + "\"";
		};
	}());
	return function (to, message, done) {
		exec(cmd(to, message), function (err, stdout, stderr) {
			console.log('########## yowsup message to: ' + to + ' ##########');
			console.log('err', err);
			console.log('stderr', stderr);
			console.log('stdout', stdout);
			try {
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
			} finally {
				console.log('############################');
			}
		});
	};
}());
