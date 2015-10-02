'use strict';

angular.module('race-day-fpv')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(FPVSession, FIREBASE_REF, $firebaseObject, $firebaseArray, $firebaseAuth) {
	var ref = FIREBASE_REF;
	var self = this;

	self.pushData = function () {
		var listRef = ref.child('events');
		var newDataRef = listRef.push();
		var newPostKey = newDataRef.key();

		var newData = {
			name: self.text,
			organiserId: FPVSession.user.$id
		};

		newDataRef.update(newData, function (error) {
			if (error) {
				console.log('Error updating data:', error);
			}
		});
	};
}
HomeCtrl.$inject = ['FPVSession', 'FIREBASE_REF', '$firebaseObject', '$firebaseArray', '$firebaseAuth'];
