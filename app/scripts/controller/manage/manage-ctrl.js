'use strict';

angular.module('race-day-fpv')
	.controller('ManageCtrl', ManageCtrl);

function ManageCtrl() {
}
ManageCtrl.$inject = ['FPVSession', 'RaceGroup', 'Frequency', 'ngToast'];
