'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($firebaseObject, $firebaseArray, $firebaseAuth) {
	// now we can use $firebase to synchronize data between clients and the server!
	var ref = new Firebase('https://race-day-fpv.firebaseio.com');
	var self = this;

	self.pushData = function () {
		var listRef = ref.child('events');
		var newDataRef = listRef.push();
		var newPostKey = newDataRef.key();

		var newData = {
			name: self.text
		};

		newDataRef.update(newData, function (error) {
			if (error) {
				console.log('Error updating data:', error);
			}
		});
	};
}
HomeCtrl.$inject = ['$firebaseObject', '$firebaseArray', '$firebaseAuth'];
