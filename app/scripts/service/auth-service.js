'use strict';

angular.module('race-day-fpv')
	.factory('Auth', Auth);

function Auth(FPVSession, FIREBASE_REF, User, Pilot, ngToast, $location, $firebaseAuth, $route, $timeout) {
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
		_userRef = null;
		_pilotRef = null;
		ref.unauth();
		$route.reload();
	}

	function authGoogle() {
		var auth = $firebaseAuth(ref);
		auth.$authWithOAuthPopup('google', {
			remember: 'default',
			scope: 'email'
		}).then(function (authData) {
			console.log('Logged in as:', authData.uid);
			_userRef = User.get(authData.uid);
			_userRef.once('value', function (snap) {
				if (snap.val() === null) {
					console.log('New user... gonna add it');
					_persistNewUser(authData, authData.google);
				} else {
					console.log('existing user... go forth in peace');
				}
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
			_userRef = User.get(authData.uid);
			_userRef.once('value', function (snap) {
				if (snap.val() === null) {
					console.log('New user... gonna add it');
					_persistNewUser(authData, authData.facebook);
				} else {
					console.log('existing user... go forth in peace');
				}
				$route.reload();
			});

		}).catch(function (error) {
			console.error('Authentication failed:', error);
		});
	}

	// Create a callback which logs the current auth state
	function authDataCallback(authData) {
		if (authData) {
			console.log('User ' + authData.uid + ' is logged in with ' + authData.provider);
			if (FPVSession.user == null && FPVSession.pilot == null) {
				console.log('Session is not initialised, now loading user');
				_userRef = User.get(authData.uid);
				_userRef.on('value', function (snap) {
					if (snap.val()) {
						FPVSession.user = snap.val();
						FPVSession.user.$id = snap.key();
						_userRef.off();

						_pilotRef = Pilot.get(authData.uid);
						_pilotRef.on('value', function (snap) {
							if (snap.val()) {
								FPVSession.pilot = snap.val();
								FPVSession.pilot.$id = snap.key();
								$timeout(function () {
									if (!FPVSession.pilot.frequencies) {
										$location.path('/me/edit');
										ngToast.warning('Please add your frequencies');
									} else {
										ngToast.success('Pilot Logged In');
									}
								});
								_pilotRef.off();
							}
						});
					}
				});
			} else {
				console.log('Session is initialised');
			}
			FPVSession.authData = authData;
		} else {
			console.log('No user logged in');
			FPVSession.user = null;
			FPVSession.pilot = null;
			_userRef = null;
			_pilotRef = null;
		}
	}

	function _persistNewUser(authData, detail) {
		var newUserObj = {
			name: detail.displayName,
			email: detail.email
		};
		var newPilotObj = {
			name: detail.displayName,
			avatar: detail.profileImageURL,
			alias: faker.fake('{{commerce.productAdjective}}{{commerce.productMaterial}}{{commerce.product}}'),
			tagline: faker.company.catchPhrase()
		};
		User.create(authData.uid, newUserObj, function (err) {
			if (err) {
				$timeout(function () {
					ngToast.warning('Error: ' + err);
				});
			} else {
				Pilot.create(authData.uid, newPilotObj, function (err) {
					if (err) {
						$timeout(function () {
							ngToast.warning('Error: ' + err);
						});
					}
				});
			}
		});
	}
}
Auth.$inject = ['FPVSession', 'FIREBASE_REF', 'User', 'Pilot', 'ngToast', '$location', '$firebaseAuth', '$route', '$timeout'];
