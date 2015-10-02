'use strict';

angular.module('race-day-fpv')
	.factory('RacerService', ['FIREBASE_REF', function (FIREBASE_REF) {
		var usersRef = FIREBASE_REF.child('users');
		return {
			getRacer: function (uid) {

			},
			allRacers: function () {

				usersRef.once("value", function (snapshot) {
					// The callback function will get called twice, once for "fred" and once for "barney"
					snapshot.forEach(function (childSnapshot) {
						// key will be "fred" the first time and "barney" the second time
						var key = childSnapshot.key();
						// childData will be the actual contents of the child
						var childData = childSnapshot.val();
					});
				});
			}
		};
	}]);

