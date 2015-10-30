'use strict';

angular.module('race-day-fpv')
	.controller('PilotEditCtrl', PilotEditCtrl);

function PilotEditCtrl(FPVSession, Pilot, ngToast, $routeParams, $location, $timeout, $scope) {
	var self = this;
	self.pilot = {};
	var userId = $routeParams.userId || FPVSession.user.$id;

	_init();

	function _init() {
		var pi = Pilot.get(userId);

		pi.on('value', function (snap) {
			self.pilot = snap.val();
		});
		$scope.$on('$destroy', function () {
			pi.off();
		});
	}

	self.save = function () {
		Pilot.update(userId, self.pilot, function (err) {
			$timeout(function () {
				if (err) {
					ngToast.danger('Error');
				} else {
					ngToast.success('Saved');
				}
			});
		});
	};

	self.cancel = function () {
		$location.path('/me');
	};
}
PilotEditCtrl.$inject = ['FPVSession', 'Pilot', 'ngToast', '$routeParams', '$location', '$timeout', '$scope'];
