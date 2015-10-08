'use strict';

angular.module('race-day-fpv')
	.directive('eventCard', eventCard)
	.run(TemplateCache);

function eventCard() {
	return {
		controller: EventCardCtrl,
		controllerAs: 'ctrl',
		restrict: 'EA',
		scope: {
			event: '='
		},
		replace: true,
		templateUrl: 'event-card.html'
	};
}

function EventCardCtrl(FIREBASE_REF, FPVSession, $firebaseObject) {
	var _ref = FIREBASE_REF;
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.uid = FPVSession.user ? FPVSession.user.$id : null;

	self.toggle = function (event) {
		if (event.show) {
			event.show = false;
		} else {
			var userRef = _ref.child('users/' + event.organiserId);
			event.organiser = $firebaseObject(userRef);
			event.show = true;
		}
	};
	self.delete = function (event) {
		$firebaseObject(_ref.child('events/' + event.$id)).$remove();
	};
}
EventCardCtrl.$inject = ['FIREBASE_REF', 'FPVSession', '$firebaseObject'];

function TemplateCache($templateCache) {
	$templateCache.put('event-card.html',
		'<div class="panel panel-default">' +
		'	<div class="panel-heading hand" ng-click="ctrl.toggle(event)">' +
		'	<div class="row">' +
		'	<div class="col-lg-12">' +
		'	<h4>{{event.name}}...</h4>' +
		'<span ng-hide="event.show"><i class="fa fa-calendar"></i>: {{event.date}}</span>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div class="panel-body" ng-show="event.show">' +
		'	<ul class="list-group">' +
		'	<li class="list-group-item"><i class="fa fa-calendar" tooltip="Date"></i>: {{event.date}}</li>' +
		'<li class="list-group-item"><i class="fa fa-map-pin" tooltip="Venue"></i>: {{event.venue}}</li>' +
		'<li class="list-group-item"><i class="fa fa-user" tooltip="Organiser"></i>: {{event.organiser.name}}</li>' +
		'<li class="list-group-item"><i class="fa fa-sticky-note" tooltip="Notes"></i>: {{event.notes}}</li>' +
		'</ul>' +
		'<span class="pull-left" ng-if="ctrl.signedIn && event.organiser.$id == ctrl.uid"><a class="btn btn-danger" ng-click="ctrl.delete(event)"><i class="fa fa-trash"></i></a></span>' +
		'<span class="pull-right"><a class="btn btn-primary" ng-href="#/event/{{event.$id}}">More</a></span>' +
		'</div>' +
		'</div>');
}
TemplateCache.$inject = ['$templateCache'];
