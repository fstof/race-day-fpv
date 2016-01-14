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
			eventId: '='
		},
		replace: true,
		templateUrl: 'event-card.html'
	};
}

function EventCardCtrl(FPVSession, Event, Pilot, Notification, RDFDateUtil, ngToast, $route, $scope, $timeout, $location) {
	var self = this;
	self.uid = FPVSession.user ? FPVSession.user.$id : null;
	self.eventId = $scope.eventId;
	self.signedIn = self.uid !== null;
	self.myEvent = false;
	self.going = false;
	self.event = null;
	self.pilotCount = 0;

	_init();

	function _init() {
		var eventRef = Event.get(self.eventId);
		eventRef.on('value', function (snap) {
			var val = snap.val();
			val.$id = snap.key();
			self.event = val;
			self.event.show = true;

			if (self.event.pilots) {
				self.going = self.event.pilots[self.uid] != null;
				self.pilotCount = Object.keys(self.event.pilots).length;
			} else {
				self.going = false;
				self.pilotCount = 0;
			}

			if (!self.event.organiser) {
				var org = Pilot.get(self.event.organiserId);
				org.once('value', function (snap) {
					self.event.organiser = snap.val().name;
				});
			}
		});
		$scope.$on('$destroy', function () {
			eventRef.off();
		});
	}

	self.goingToggle = function () {
		if (self.going) {

			Pilot.removeEvent(FPVSession.user.$id, self.event.$id, function (err) {
				if (!err) {
					Event.removeRacer(self.event.$id, FPVSession.user.$id, function (err) {
						$timeout(function () {
							if (err) {
								ngToast.danger('Error');
							} else {
								ngToast.success('Too bad');
							}
						});
					});
				}
			});

		} else {

			var obj = {checkedIn: false};
			Pilot.addEvent(FPVSession.user.$id, self.event.$id, function (err) {
				if (!err) {
					Event.addRacer(self.event.$id, FPVSession.user.$id, obj, function (err) {
						$timeout(function () {
							if (err) {
								ngToast.danger('Error');
							} else {
								ngToast.success('See you there');
							}
						});
					});
				}
			});
		}
	};

	self.viewToggle = function () {
		$location.path('/events/' + self.event.$id);
		//if (self.event.show) {
		//	self.event.show = false;
		//} else {
		//	self.event.show = true;
		//}
	};
	self.delete = function () {
		Event.delete(self.event.$id, function (err) {
			if (err) {
				ngToast.danger('Could not delete');
			} else {
				ngToast.success('Event deleted');
				Pilot.removeEvent(FPVSession.user.$id, self.event.$id);
			}
		});
	};
}
EventCardCtrl.$inject = ['FPVSession', 'Event', 'Pilot', 'Notification', 'RDFDateUtil', 'ngToast', '$route', '$scope', '$timeout', '$location'];

function TemplateCache($templateCache) {
	$templateCache.put('event-card.html',
		'<div class="panel panel-default">' +
		'	<div class="panel-heading ">' +
		'		<div class="row">' +
		'			<div class="col-lg-12">' +
		'				<h4 class="pull-left hand" ng-click="ctrl.viewToggle()">{{ctrl.event.name}}<br/><small>{{ctrl.pilotCount}} attending</small></h4>' +
		//'				<div class="pull-right">' +
		//'					<button type="button" class="btn btn-success" logged-in ng-click="ctrl.goingToggle()">' +
		//'						<i class="fa fa-check-square-o" ng-show="ctrl.going"></i>' +
		//'						<i class="fa fa-square-o" ng-hide="ctrl.going"></i>' +
		//'					</button>' +
		//'				</div>' +
		'			</div>' +
		'		</div>' +
		'		<div class="row">' +
		'			<div class="col-lg-12">' +
		'				<span class="clearfix" ng-hide="ctrl.event.show"><i class="fa fa-calendar"></i>: {{ctrl.event.date | date:\'yyyy-MM-dd hh:mm\'}}</span>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'	<div class="panel-body" ng-show="ctrl.event.show">' +
		'		<ul class="list-group">' +
		'			<li class="list-group-item"><i class="fa fa-calendar" tooltip="Date"></i>: {{ctrl.event.date | date:\'yyyy-MM-dd hh:mm\'}}</li>' +
		'			<li class="list-group-item"><i class="fa fa-home" tooltip="Venue"></i>: {{ctrl.event.venue}} <a target="_blank" ng-href="{{ctrl.event.map}}" ng-show="ctrl.event.map"><i class="fa fa-map-marker"></i></a></li>' +
		'			<li class="list-group-item"><i class="fa fa-user" tooltip="Organiser"></i>: {{ctrl.event.organiser}}</li>' +
		'		</ul>' +
		'		<span class="" my-item="ctrl.event.organiserId"><a class="btn btn-warning" ng-href="#/events/{{ctrl.event.$id}}/edit"><i class="fa fa-edit"></i></a></span>' +
		'		<span class="" my-item="ctrl.event.organiserId"><a class="btn btn-danger" ng-click="ctrl.delete()"><i class="fa fa-trash"></i></a></span>' +
		'		<span class="pull-right"><a class="" ng-href="#/events/{{ctrl.event.$id}}">More...</a></span>' +
		'	</div>' +
		'</div>');
}
TemplateCache.$inject = ['$templateCache'];
