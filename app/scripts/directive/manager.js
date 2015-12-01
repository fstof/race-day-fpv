'use strict';

angular.module('race-day-fpv')
	.directive('manager', manager);

function manager(FPVSession) {
	return {
		restrict: 'A',
		link: function ($scope, element) {
			$scope.session = FPVSession;

			if (FPVSession.user === null || !FPVSession.user.manager) {
				element.hide();
			} else {
				element.show();
			}

			$scope.$watch('session.user',
				function (newValue, oldValue) {
					if (oldValue === newValue) {
						return;
					}

					if (FPVSession.user === null || !FPVSession.user.manager) {
						element.hide();
					} else {
						element.show();
					}
				}
			);
		}
	};
}

manager.$inject = ['FPVSession'];
