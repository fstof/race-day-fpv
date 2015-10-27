'use strict';

angular.module('race-day-fpv')
	.directive('myItem', myItem);

function myItem(FPVSession) {
	return {
		restrict: 'A',

		link: function ($scope, element, attributes) {
			var expression = attributes.myItem;

			var ownerId = $scope.$eval(expression);

			if (FPVSession.user.$id !== ownerId) {
				element.hide();
			} else {
				element.show();
			}

			$scope.$watch(expression,
				function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}
					if (FPVSession.user.$id !== newValue) {
						element.hide();
					} else {
						element.show();
					}
				}
			);
		}
	};
}

myItem.$inject = ['FPVSession'];
