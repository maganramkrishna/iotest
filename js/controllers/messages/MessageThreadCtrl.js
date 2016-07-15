/*global define, console */

define(function () {
	'use strict';

	function ctrl($scope, $state, $timeout, $rootScope, ImageService, CONFIG, MessageService, CommentsService, $ionicLoading, $ionicScrollDelegate) {

		$scope.messageList = [];
		$scope.currentUserId = window.localStorage.getItem("userId");
		$scope.newcomment = {
			parentId: $state.params.threadParentId	
		};
		
		$scope.getMessageThread = function() {
			MessageService.getMessageThread($state.params.threadParentId, function(err, messageThread){
				$scope.messageList = messageThread.data;
				$scope.showMessage = !$scope.messageList || $scope.messageList.length === 0;
				console.log($scope.messageList[0].listing);
				if($scope.messageList.length > 0) {
					$scope.listingId = $scope.messageList[0].listing ? $scope.messageList[0].listing.id : 0;
					$scope.orderId = $scope.messageList[0].order ? $scope.messageList[0].order.id: 0;
				}
				console.log('$scope.listingId', $scope.listingId);
				console.log('$scope.orderId', $scope.orderId);
				$timeout(function(){
				    $ionicScrollDelegate.scrollBottom(true);
				});
			});
		};

		$scope.$on('$ionicView.enter', function(e) {
			$scope.getMessageThread();
		});
		
		$scope.postMessage = function(){
			$ionicLoading.show({template: 'Posting comment'});
			if($scope.listingId > 0) {
				CommentsService.postComment($scope.newcomment.message, $scope.listingId, window.localStorage.getItem('userId'), $state.params.threadParentId	 || 0,
					function(err, commentResponse){
						if(!err) {
							$ionicLoading.hide();
							$scope.messageList.push(commentResponse.data);
							$scope.newcomment.message = '';
						} else {
							$ionicLoading.show({template: err ? err.data : 'something went wrong, please try again later', duration: 4000, delay: 1000});
						}
						$timeout(function(){
						    $ionicScrollDelegate.scrollBottom(true);
						});
				});
			} else if($scope.orderId > 0) {
				MessageService.postPrivateMessage($scope.newcomment.message, $state.params.threadParentId || 0 , $scope.orderId, window.localStorage.getItem('userId'), 
					function(err, messageResponse) {
						if(!err) {
							$ionicLoading.hide();
							$scope.messageList.push(messageResponse.data);
							$scope.newcomment.message = '';
						} else {
							$ionicLoading.show({template: err ? err.data: 'something went wrong, please try again later', duration: 4000, delay: 1000});
						}
						$timeout(function(){
						    $ionicScrollDelegate.scrollBottom(true);
						});
				});
			} else {
				$ionicLoading.show({template: 'Invalid comment thread', duration:2000, delay: 100});
			}	
		};
	}

	ctrl.$inject = ['$scope', '$state', '$timeout', '$rootScope', 'ImageService', 'CONFIG', 'MessageService', 'CommentsService', '$ionicLoading', '$ionicScrollDelegate'];
	return ctrl;

});
