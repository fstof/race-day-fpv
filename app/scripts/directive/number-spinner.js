'use strict';

angular.module('race-day-fpv')
	.directive('numberSpinner', numberSpinner)
	.run(TemplateCache);

function numberSpinner() {
	return {
		controller: NumSpinCtrl,
		controllerAs: 'ctrl',
		restrict: 'EA',
		scope: {
			number: '=',
			onchange: '='
		},
		replace: true,
		templateUrl: 'number-spinner.html'
	};
}

function NumSpinCtrl($scope) {
	$scope.number = $scope.number || 0;

	$scope.incrementNumber = function () {
		$scope.number++;
		if ($scope.onchange)
			$scope.onchange($scope.number);
	};
	$scope.decrementNumber = function () {
		$scope.number--;
		if ($scope.onchange)
			$scope.onchange($scope.number);
	};
}
NumSpinCtrl.$inject = ['$scope'];

function TemplateCache($templateCache) {
	$templateCache.put('number-spinner.html',
		'<table>' +
		'	<tr class="text-center">' +
		'		<td><a ng-click="incrementNumber()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>' +
		'	</tr>' +
		'	<tr>' +
		'		<td class="form-group">' +
		'			<input style="width:50px;" type="text" ng-model="number" class="form-control text-center">' +
		'		</td>' +
		'	</tr>' +
		'	<tr class="text-center" >' +
		'		<td><a ng-click="decrementNumber()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>' +
		'	</tr>' +
		'</table>');
}
TemplateCache.$inject = ['$templateCache'];
