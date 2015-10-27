'use strict';

angular.module('race-day-fpv')
	.factory('Auth', Auth);

function Auth(FPVSession, FIREBASE_REF, ngToast, $firebaseObject, $firebaseAuth, $route, $location) {
	var ref = FIREBASE_REF;
	var _userRef = null;
	var _pilotRef = null;

	return {
		authGoogle: authGoogle,
		authFacebook: authFacebook,
		deAuth: deAuth,

		authDataCallback: authDataCallback
	};

	function deAuth() {
		ref.unauth();
		_userRef = null;
		FPVSession.user = null;
		FPVSession.pilot = null;
		//$location.path('/home');
		$route.reload();
	}

	function authGoogle() {
		var auth = $firebaseAuth(ref);
		auth.$authWithOAuthPopup('google', {
			remember: 'default',
			scope: 'email'
		}).then(function (authData) {
			console.log('Logged in as:', authData.uid);
			_userRef = _getUserRef(authData.uid);
			_userRef.once('value', function (snap) {
				if (snap.val() === null) {
					console.log('New user... gonna add it');
					_persistNewUser(authData, authData.google);
				} else {
					console.log('existing user... go forth in peace');
				}
				$location.path('/events/me');
				$route.reload();
			});

		}).catch(function (error) {
			console.error('Authentication failed:', error);
		});
	}

	function authFacebook() {
		var auth = $firebaseAuth(ref);
		auth.$authWithOAuthPopup('facebook', {
			remember: 'default',
			scope: 'email'
		}).then(function (authData) {
			console.log('Logged in as:', authData.uid);
			_userRef = _getUserRef(authData.uid);
			_userRef.once('value', function (snap) {
				if (snap.val() === null) {
					console.log('New user... gonna add it');
					_persistNewUser(authData, authData.facebook);
				} else {
					console.log('existing user... go forth in peace');
				}
				//$location.path('/events/me');
				$route.reload();
			});

		}).catch(function (error) {
			console.error('Authentication failed:', error);
		});
	}

	// Create a callback which logs the current auth state
	function authDataCallback(authData) {
		if (authData) {
			if (FPVSession.user === null) {
				console.log('User ' + authData.uid + ' is logged in with ' + authData.provider);
				_userRef = _getUserRef(authData.uid);
				_pilotRef = _getPilotRef(authData.uid);
				FPVSession.user = $firebaseObject(_userRef);
				FPVSession.pilot = $firebaseObject(_pilotRef);
			} else {
				console.log('all good');
			}
			FPVSession.userRef = _getUserRef(authData.uid);
			FPVSession.authData = authData;
		} else {
			console.log('User is logged out');
			FPVSession.user = null;
			FPVSession.userRef = null;
			_userRef = null;
		}
	}

	function _persistNewUser(authData, detail) {
		_userRef = _getUserRef(authData.uid);
		_userRef.set({
			name: detail.displayName,
			email: detail.email
		}, function (err) {
			if (err) {
				ngToast.warning('Error: ' + err);
			}
		});
		_pilotRef = _getPilotRef(authData.uid);
		_pilotRef.set({
			name: detail.displayName,
			avatar: detail.profileImageURL,
			alias: faker.fake('{{commerce.productAdjective}}{{commerce.productMaterial}}{{commerce.product}}'),
			tagline: faker.company.catchPhrase()
		}, function (err) {
			if (err) {
				ngToast.warning('Error: ' + err);
			}
		});
	}

	function _getUserRef(uid) {
		if (_userRef === null) {
			_userRef = ref.child('users/' + uid);
		}
		return _userRef;
	}

	function _getPilotRef(uid) {
		if (_pilotRef === null) {
			_pilotRef = ref.child('pilots/' + uid);
		}
		return _pilotRef;
	}
}
Auth.$inject = ['FPVSession', 'FIREBASE_REF', 'ngToast', '$firebaseObject', '$firebaseAuth', '$route', '$location'];
