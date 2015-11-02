'use strict';

angular.module('race-day-fpv')
	.factory('RDFDateUtil', RDFDateUtil);

function RDFDateUtil($filter) {
	return {
		todayDate: todayDate,
		todayDateTime: todayDateTime,
		startOfDate: startOfDate,
		stringValue: stringValue,
		shuffle: shuffle
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

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}


}
RDFDateUtil.$inject = ['$filter'];
