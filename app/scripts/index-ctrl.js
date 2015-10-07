'use strict';

angular.module('race-day-fpv')
	.controller('IndexCtrl', IndexCtrl);

function IndexCtrl(Auth, FPVSession, FIREBASE_REF) {
	var ref = FIREBASE_REF;
	var self = this;
	self.active = 'home';
	self.navCollapsed = true;
	self.FPVSession = FPVSession;

	ref.onAuth(Auth.authDataCallback);

	self.logout = function () {
		Auth.deAuth();
	};

	self.login = function (provider) {
		if (provider === 'google') {
			Auth.authGoogle();
		} else if (provider === 'facebook') {
			Auth.authFacebook();
		}
	};
}
IndexCtrl.$inject = ['Auth', 'FPVSession', 'FIREBASE_REF'];
