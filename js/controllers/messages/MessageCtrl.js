/*global define, console */

define(function () {
	'use strict';

	function ctrl($scope, $state, $stateParams, $timeout, $rootScope, ImageService, CONFIG, ListingService, ionicMaterialInk, ionicMaterialMotion, MessageService) {

		$scope.messageList = $scope.messageListingList = $scope.messagePrivateList = [];
		$scope.selection = $stateParams.state || 'buying';
		$scope.messageListingListLabel = "Loading ..";
		$scope.messageListLabel = "Loading ..";
		$scope.messagePrivateListLabel = "Loading ..";

		// Activate ink for controller
	    ionicMaterialInk.displayEffect();

	    if(window.location.hash.indexOf('?') === -1) {
	    	// window.location.hash = window.location.hash + "?state=" + $scope.selection;
	    }

	    $scope.getUserMessages = function() {
    		ListingService.getUserMessages(window.localStorage.getItem('userId'), function(err, response){
				console.log(err, response);
				if(response && response.data) {
					$scope.messageList = response.data;
				}

				$scope.messageListLabel = $scope.messageList.length === 0 ? "No messages yet" : $scope.messageListLabel;

				$timeout(function () {
					ionicMaterialMotion.fadeSlideIn({
						selector: '.animate-fade-slide-in-right .item'
					});
				}, 200);
			});
    	};

		$scope.getUserListingsMessages = function() {
			ListingService.getUserListingsMessages(window.localStorage.getItem('userId'), function(err, response){
				if(response && response.data) {
					$scope.messageListingList = response.data;
				}

				$scope.messageListingListLabel = $scope.messageListingList.length === 0 ? "No messages yet" : $scope.messageListingListLabel;

				$timeout(function () {
					ionicMaterialMotion.fadeSlideIn({
						selector: '.animate-fade-slide-in-right .item'
					});
				}, 200);
			});
		};

		$scope.getUserPrivateMessages = function() {
			MessageService.getUserPrivateMessages(function(err, response){
				if(response && response.data) {
					$scope.messagePrivateList = response.data;
				}
				$scope.messagePrivateListLabel = $scope.messageListingList.length === 0 ? "No messages yet" : $scope.messageListingListLabel;
			});
		};

	    $scope.loadSection = function(selection) {
	    	switch(selection.toLowerCase()) {
	    		case 'buying':
	    			$scope.getUserMessages();
	    			break;
    			case 'selling':
    				$scope.getUserListingsMessages();
	    			break;
    			case 'private':
    				$scope.getUserPrivateMessages();
	    			break;
	    	}
	    };


	    $scope.loadSection($scope.selection);

	    $scope.changeTab = function(selection) {
	    	$scope.selection = selection;
	    	//window.location.hash = window.location.hash.split('?')[0] + "?state=" + $scope.selection;
	    	$scope.loadSection(selection);
    	};

    	

		$scope.filterParents = function(item){ 
			return item.parentId === 0 && !item.isPrivate;
		};

		$scope.filterParentsPrivate = function(item) {
			return item.parentId === 0 && item.isPrivate;	
		};


	}

	ctrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', '$rootScope', 'ImageService', 'CONFIG', 'ListingService', 'ionicMaterialInk', 'ionicMaterialMotion', 'MessageService'];
	return ctrl;

});
