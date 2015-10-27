'use strict';

angular.module('race-day-fpv')
	.directive('loggedIn', loggedIn);

function loggedIn(FPVSession) {
	return {
		restrict: 'A',
		link: function ($scope, element, attributes) {
			var loggedIn = attributes.loggedIn === "" || attributes.loggedIn === "true";
			$scope.session = FPVSession;

			if (loggedIn) {
				if (FPVSession.user === null) {
					element.hide();
				} else {
					element.show();
				}
			} else {
				if (FPVSession.user !== null) {
					element.hide();
				} else {
					element.show();
				}
			}

			$scope.$watch('session.user',
				function (newValue, oldValue) {
					if (oldValue === newValue) {
						return;
					}

					if (loggedIn) {
						if (FPVSession.user === null) {
							element.hide();
						} else {
							element.show();
						}
					} else {
						if (FPVSession.user !== null) {
							element.hide();
						} else {
							element.show();
						}
					}
				}
			);
		}
	};
}

loggedIn.$inject = ['FPVSession'];
