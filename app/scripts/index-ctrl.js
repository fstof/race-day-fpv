'use strict';

angular.module('race-day-fpv')
	.controller('IndexCtrl', IndexCtrl);

function IndexCtrl(FPVSession, FIREBASE_REF, $firebaseObject, $firebaseArray, $firebaseAuth) {
	var ref = FIREBASE_REF;
	var self = this;
	self.active = 'home';
	self.navCollapsed = true;
	self.FPVSession = FPVSession;
  var _userRef = null;

	ref.onAuth(authDataCallback);

	self.deAuth = function () {
		ref.unauth();
    _userRef = null;
	};

	self.auth = function () {
		var auth = $firebaseAuth(ref);
		auth.$authWithOAuthPopup('google', {
			remember: 'sessionOnly',
			scope: 'email'
		}).then(function (authData) {
			console.log('Logged in as:', authData.uid);
      _userRef = _getUserRef(authData.uid);
      _userRef.once('value', function (snap) {
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
        _userRef = _getUserRef(authData.uid);
				FPVSession.user = $firebaseObject(_userRef);
			} else {
				console.log('all good');
			}
      FPVSession.userRef = _getUserRef(authData.uid);
		} else {
			console.log('User is logged out');
			FPVSession.user = null;
      FPVSession.userRef = null;
      _userRef = null;
		}
		console.log('bob' + FPVSession.user);
	}

	function persistNewUser(authData) {
    _userRef = _getUserRef(authData.uid);
    _userRef.set({
			name: authData.google.displayName,
			profileImageURL: authData.google.profileImageURL,
			email: authData.google.email
		});
	}

  function _getUserRef(uid) {
    if (_userRef == null) {
      _userRef = ref.child('users/' + uid);
    }
    return _userRef;
  }
}
IndexCtrl.$inject = ['FPVSession', 'FIREBASE_REF', '$firebaseObject', '$firebaseArray', '$firebaseAuth'];
