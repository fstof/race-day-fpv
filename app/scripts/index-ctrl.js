'use strict';

angular.module('race-day-fpv')
	.controller('IndexCtrl', IndexCtrl);

function IndexCtrl(FPVSession, $firebaseObject, $firebaseArray, $firebaseAuth) {
	var ref = new Firebase('https://race-day-fpv.firebaseio.com');
	var self = this;
	self.active = 'home';
	self.navCollapsed = true;
	self.FPVSession = FPVSession;

	ref.onAuth(authDataCallback);

	self.deAuth = function () {
		ref.unauth();
	};

	self.auth = function () {
		var auth = $firebaseAuth(ref);
		auth.$authWithOAuthPopup('google', {
			remember: 'sessionOnly',
			scope: 'email'
		}).then(function (authData) {
			console.log('Logged in as:', authData.uid);
			var userRef = ref.child('users/' + authData.uid);
			userRef.once('value', function (snap) {
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
			if (FPVSession.user === null) {
				console.log('User ' + authData.uid + ' is logged in with ' + authData.provider);
				var userRef = ref.child('users/' + authData.uid);
				FPVSession.user = $firebaseObject(userRef);
			} else {
				console.log('all good');
			}
		} else {
			console.log('User is logged out');
			FPVSession.user = null;
		}
		console.log('bob' + FPVSession.user);
	}

	function persistNewUser(authData) {
		var userRef = ref.child('users/' + authData.uid);
		userRef.set({
			name: authData.google.displayName,
			profileImageURL: authData.google.profileImageURL,
			email: authData.google.email
		});
	}
}
IndexCtrl.$inject = ['FPVSession', '$firebaseObject', '$firebaseArray', '$firebaseAuth'];
