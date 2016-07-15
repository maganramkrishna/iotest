define(function () {
	'use strict';
	
	function ctrl($scope, $state, $timeout, $filter, $ionicLoading, OrderService, MessageService, moment, NotificationService, $ionicScrollDelegate) {
		$scope.selection = 'placed';
		$scope.orderId = $state.params.orderId;
		$scope.actions = [{
			'id': 'actions',	
			'label': 'Actions'	
		},{
			'id': 'accept',	
			'label': 'Accept'	
		},{
			'id': 'cancel',	
			'label': 'Cancel'	
		}];

		$scope.getOrderDetails = function() {
			OrderService.getOrderDetails($scope.orderId, function(err, orderDetails){
				$scope.orderDetails = orderDetails.data;
				$scope.parentId = $scope.orderDetails.chats.length > 0 ?  $filter('filter')($scope.orderDetails.chats, function(c){
					return c.parentId === 0;
				})[0].id : 0;

				$timeout(function(){
				    $ionicScrollDelegate.scrollBottom(true);
				});
			});
		};

		$scope.$on('$ionicView.enter', function(e) {
			$scope.getOrderDetails();
		});


		$scope.showNextBuyerHelp = function() {
			NotificationService.showHelpMessage('What to do next ?', 'Start private chats with seller and meet at a common place. Exchange the order fulfillment code and complete the purchase.');
		};

		$scope.showNextSellerHelp = function() {
			NotificationService.showHelpMessage('What to do next ?', 'Start private chats with seller and meet at a common place. Enter the order fulfillment code and complete the purchase.');
		};

		/*
		   * if given group is the selected group, deselect it
		   * else, select the given group
		   */
		$scope.toggleGroup = function(group) {
		    if ($scope.isGroupShown(group)) {
		    	$scope.shownGroup = null;
		    } else {
		    	$scope.shownGroup = group;
		    }
		};
		
		$scope.isGroupShown = function(group) {
		    return $scope.shownGroup === group;
		};

		$scope.orderAction = function() {
			console.log($scope.actions);
		};

		$scope.postPrivateMessage = function() {
			$ionicLoading.show({template: 'Posting comment'});
			MessageService.postPrivateMessage($scope.postMessage, $scope.parentId, $scope.orderDetails.order.id, window.localStorage.getItem('userId'), 
				function(err, messageResponse) {
					if(!err) {
						$ionicLoading.hide();
						$scope.postMessage = '';
						$scope.orderDetails.chats.push(messageResponse.data);
						if($scope.parentId === 0) {
							$scope.parentId = messageResponse.data.id;
						}
					} else {
						$ionicLoading.show({template: err ? err.data: 'something went wrong, please try again later', duration: 4000, delay: 1000});
					}
					$timeout(function(){
					    $ionicScrollDelegate.scrollBottom(true);
					});
			});
		};

	}

	ctrl.$inject = ['$scope', '$state', '$timeout', '$filter', '$ionicLoading', 'OrderService', 'MessageService', 'moment', 'NotificationService', '$ionicScrollDelegate'];
	return ctrl;

});
