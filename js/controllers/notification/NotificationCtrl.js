/*global define, console */

define(function () {
	'use strict';

	function ctrl($scope, $state, $timeout, $rootScope, NotificationService, $filter) {
		$scope.showingAll = false;
		$scope.getNotifications = function() {
			$scope.showingAll = false;
			NotificationService.getAllNotifications(window.localStorage.getItem('userId'), false, function(err, notificationResponse){
				$scope.notifications = notificationResponse && notificationResponse.data ? notificationResponse.data : [];
				$scope.$broadcast('scroll.refreshComplete');
				var notificationIds = $scope.notifications.map(function(elem) {
					return elem.id;
				});

				NotificationService.markAllRead(notificationIds,function() {});
			});
		};
		
		$scope.$on('$ionicView.beforeEnter', function(){
			$scope.getNotifications();
	    });

	    $scope.doRefresh = function() {
	    	$scope.getNotifications();
	    };

	    $scope.showAllNotifications = function() {
	    	$scope.showingAll = true;
	    	NotificationService.getAllNotifications(window.localStorage.getItem('userId'), true, function(err, notificationResponse){
				$scope.notifications = notificationResponse && notificationResponse.data ? notificationResponse.data : [];
			});
	    };

	}

	ctrl.$inject = ['$scope', '$state', '$timeout', '$rootScope', 'NotificationService', '$filter'];
	return ctrl;

});
