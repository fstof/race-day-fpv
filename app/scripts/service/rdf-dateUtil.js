'use strict';

angular.module('race-day-fpv')
	.factory('RDFDateUtil', RDFDateUtil);

function RDFDateUtil($filter) {
	return {
		todayDate: todayDate,
		todayDateTime: todayDateTime,
		startOfDate: startOfDate,
		stringValue: stringValue
	};

	function todayDate() {
		var now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	function todayDateTime() {
		return todayDate().getTime();
	}

	function startOfDate(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function stringValue(date) {
		return $filter('date')(date, 'yyyy-MM-dd');
	}


}
RDFDateUtil.$inject = ['$filter'];
