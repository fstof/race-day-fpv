'use strict';

angular.module('race-day-fpv')
	.factory('Frequency', Frequency);

function Frequency(FIREBASE_REF) {
	var ref = FIREBASE_REF;

	return {
		all: function () {
			return ref.child('frequencies').orderByChild('frequency');
		},
		get: function (id) {
			return ref.child('frequencies').child(id);
		},
		create: function (frequency, callback) {
			return ref.child('frequencies').push(frequency, callback);
		},
		delete: function (id, callback) {
			return ref.child('frequencies/' + id).set(null, callback);
		},
		save: function (id, frequency, callback) {
			return ref.child('frequencies/' + id).set(frequency, callback);
		}
	};
}

Frequency.$inject = ['FIREBASE_REF'];
