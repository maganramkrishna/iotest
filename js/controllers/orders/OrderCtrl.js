define(function () {
	'use strict';
	
	function ctrl($scope, $state, $timeout, $ionicModal, $ionicLoading, OrderService, UserService, stripe, moment) {
		$scope.selection = 'placed';

		OrderService.getMyOrders(window.localStorage.getItem('userId'), function(err, orders){
			$scope.sellerOrders = orders.data;
		});

		OrderService.getRequestedOrders(window.localStorage.getItem('userId'), function(err, orders){
			$scope.buyerOrders = orders.data;
		});
		
		/*
		   * if given group is the selected group, deselect it
		   * else, select the given group
		   */
		$scope.toggleGroup = function(group) {
			$scope.oDetail = null;
		    if ($scope.isGroupShown(group)) {
		    	$scope.shownGroup = null;
		    } else {
		    	$scope.shownGroup = group;
		    	OrderService.getOrderDetails(group, function(err, orderDetails){
					$scope.oDetail = orderDetails.data;
				});	
		    }
		};
		
		$scope.isGroupShown = function(group) {
		    return $scope.shownGroup === group;
		};

	}

	ctrl.$inject = ['$scope', '$state', '$timeout', '$ionicModal', '$ionicLoading', 'OrderService', 'UserService', 'stripe', 'moment'];
	return ctrl;

});
