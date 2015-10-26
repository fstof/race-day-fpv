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

function EventCardCtrl(FPVSession, Event, User, ngToast, $route, $scope) {
	var self = this;
	self.signedIn = FPVSession.user !== null;
	self.uid = FPVSession.user ? FPVSession.user.$id : null;
	self.going = false;
	if ($scope.event.pilots) {
		self.going = $scope.event.pilots[self.uid] != null;
	}

	self.goingToggle = function (event) {
		if (self.going) {
			User.removeEvent(FPVSession.user.$id, event.$id);
			Event.removeRacer(event.$id, FPVSession.user.$id, function (err) {
				if (err) {
					ngToast.danger('Error');
				} else {
					ngToast.success('Too bad');
					//delete $scope.event.pilots[self.uid];
				}
				if ($scope.event.pilots) {
					self.going = $scope.event.pilots[self.uid] != null;
				} else {
					self.going = false;
				}
			});
		} else {
			var obj = {checkedIn: false};
			User.addEvent(FPVSession.user.$id, event.$id);
			Event.addRacer(event.$id, FPVSession.user.$id, obj, function (err) {
				if (err) {
					ngToast.danger('Error');
				} else {
					ngToast.success('See you there');
					//$scope.event.pilots[self.uid] = obj;
				}
				if ($scope.event.pilots) {
					self.going = $scope.event.pilots[self.uid] != null;
				}
			});
		}
	};

	self.toggle = function (event) {
		if (event.show) {
			event.show = false;
		} else {
			if (!event.organiser) {
				var org = User.get(event.organiserId);
				org.once('value', function (snap) {
					event.organiser = snap.val();
				})
			}
			event.show = true;
		}
	};
	self.delete = function (event) {
		Event.delete(event.$id, function (err) {
			if (err) {
				ngToast.danger('Could not delete');
			} else {
				ngToast.success('Event deleted');
				$route.reload();
			}
		});
	};
}
EventCardCtrl.$inject = ['FPVSession', 'Event', 'User', 'ngToast', '$route', '$scope'];

function TemplateCache($templateCache) {
	$templateCache.put('event-card.html',
		'<div class="panel panel-default">' +
		'	<div class="panel-heading ">' +
		'		<div class="row">' +
		'			<div class="col-lg-12">' +
		'				<h4 class="pull-left hand" ng-click="ctrl.toggle(event)">{{event.name}}</h4>' +
		'				<div class="pull-right">' +
		'					<button type="button" class="btn btn-primary" ng-click="ctrl.goingToggle(event)">' +
		'						<i class="fa fa-check-square" ng-show="ctrl.going"></i>' +
		'						<i class="fa fa-square" ng-hide="ctrl.going"></i>' +
		'					</button>' +
		'				</div>' +
		'			</div>' +
		'		</div>' +
		'		<div class="row">' +
		'			<div class="col-lg-12">' +
		'				<span class="clearfix" ng-hide="event.show"><i class="fa fa-calendar"></i>: {{event.date | date:\'yyyy-MM-dd hh:mm\'}}</span>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'	<div class="panel-body" ng-show="event.show">' +
		'		<ul class="list-group">' +
		'			<li class="list-group-item"><i class="fa fa-calendar" tooltip="Date"></i>: {{event.date | date:\'yyyy-MM-dd hh:mm\'}}</li>' +
		'			<li class="list-group-item"><i class="fa fa-map-pin" tooltip="Venue"></i>: {{event.venue}}</li>' +
		'			<li class="list-group-item"><i class="fa fa-user" tooltip="Organiser"></i>: {{event.organiser.name}}</li>' +
		'			<li class="list-group-item"><i class="fa fa-sticky-note" tooltip="Notes"></i>: {{event.notes}}</li>' +
		'		</ul>' +
		'		<span class="pull-left" ng-if="ctrl.signedIn && event.organiserId == ctrl.uid"><a class="btn btn-danger" ng-click="ctrl.delete(event)"><i class="fa fa-trash"></i></a></span>' +
		'		<span class="pull-right"><a class="btn btn-primary" ng-href="#/events/{{event.$id}}">More</a></span>' +
		'	</div>' +
		'</div>');
}
TemplateCache.$inject = ['$templateCache'];
