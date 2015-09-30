/* global Firebase */

'use strict';

angular.module('race-day-fpv')
	.controller('MainCtrl', function ($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {
		// now we can use $firebase to synchronize data between clients and the server!
		var ref = new Firebase('https://race-day-fpv.firebaseio.com');
		var self = this;

		var listRef = null;

		self.obj = $firebaseObject(ref);
		self.data = {};
		self.user = {};

		self.loadEvents = function () {
			listRef = ref.child('events');
			self.data = $firebaseArray(listRef);
		};

		self.loadUsers = function () {
			listRef = ref.child('users');
			self.data = $firebaseArray(listRef);
		};
		self.pushData = function () {
			var newDataRef = listRef.push();
			var newPostKey = newDataRef.key();

			var newData = {
				someText: self.text
			};

			newDataRef.update(newData, function (error) {
				if (error) {
					console.log("Error updating data:", error);
				}
			});
		};
		self.deAuth = function () {
			ref.unauth();
		};
		self.auth = function () {
			var auth = $firebaseAuth(ref);
			auth.$authWithOAuthPopup('google', {
				remember: "sessionOnly",
				scope: "email"
			}).then(function (authData) {
				console.log('Logged in as:', authData.uid);
				console.log(authData);
				var userRef = ref.child('users/' + authData.uid);
				userRef.once('value', function(snap) {
					if (snap.val() === null) {
						console.log('New user... gonna add it');
						persistNewUser(authData);
					} else {
						console.log('existing user... go forth in peace');
					}
				});

			}).catch(function (error) {
				console.error('Authentication failed:', error);
			});
		};

		// Create a callback which logs the current auth state
		function authDataCallback(authData) {
			if (authData) {
				console.log("User " + authData.uid + " is logged in with " + authData.provider);
				self.user.id = authData.uid;
				self.user.name = authData.google.displayName;
			} else {
				console.log("User is logged out");
				self.user = {};
			}
			console.log(authData);
		}

		ref.onAuth(authDataCallback);

		function persistNewUser(authData) {
			var userRef = ref.child('users/' + authData.uid);
			userRef.set({
				name: authData.google.displayName,
				profileImageURL: authData.google.profileImageURL,
				email: authData.google.email
			});
		}
	});
