define(function () {
	'use strict';

	function ctrl($scope, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, ListingService, 
		ImageService, FavoritesService, $filter, $ionicActionSheet, $cordovaSocialSharing, $ionicPopup, $ionicLoading) {

		var currentUserId = window.localStorage.getItem('userId');
		$scope.selection = 'active';
		function loadFavorites(){
			if(currentUserId){
				FavoritesService.getFavoriteListings(currentUserId, function(err, favoriteList){
					console.log(err, favoriteList);
					$scope.favoriteList = err ? []: favoriteList.data;
				});
			}
		}

		$scope.showOptions = function($event, listing) {

		   	$event.stopPropagation();
			var options = {
			     buttons: [
			       { text: 'Share This' },
			       { text: 'Repost' },
			       { text: 'Edit' },
			       { text: 'View' }
			     ],
			     
			     titleText: listing.name,
			     cancelText: 'Cancel',
			     cancel: function() {
			          // add cancel code..
			     },
			     buttonClicked: function(index) {
			     	console.log(index);
			     	switch(index) {
			     		case 0:
			     			$scope.shareProduct(listing);
			     			break;
		     			case 1:
		     				$scope.repost(listing);
			     			break;
		     			case 2:
		     				$scope.edit(listing);
			     			break;
		     			case 3: 
		     				$scope.gotoListing(listing);
		     				break;
			     	}
			       return true;
			     }
		   	};

		   	if(!listing.isSold) {
		   		options.destructiveText = 'remove post';
		   		options.destructiveButtonClicked = function() {
		   			$ionicLoading.show({
				      template: 'Updating listing details'
				    });
		   			ListingService.updateListing({id: listing.id, isPrivate: true}, function(err) {
		   				$ionicLoading.show({
					      template: !err ?  'Listing will be remove shortly' : 'Something went wrong please contact support',
					      duration: 2000
					    });
		   			});
		   		};
		   	}

			$ionicActionSheet.show(options);
			return false;
		};


		$scope.gotoListing = function(listing) {
			$state.go('app.listing', {listingId: listing.id});
		};

	 	$scope.shareProduct = function(listing) {
	   		var message = "Checkout my product on hotspot";
	   		var link = "hso://app/listing/" + listing.id;
	   		var subject = "Checkout my post";

	   		$cordovaSocialSharing
			.share(message, subject, [], link) // Share via native share sheet
			.then(function (result) {
				// Success!
			}, function (err) {
				// An error occured. Show a message to the user
			});
	   	};

	   	$scope.repost = function(listing) {
	   		var confirmPopup = $ionicPopup.confirm({
			     title: listing.name,
			     template: 'Are you sure you want to repost this item?'
			   });

			   confirmPopup.then(function(res) {
			     if(res) {
			       $state.go("app.createListing", {listingId: listing.id, repost: true});
			     } else {
			       console.log('You are not sure');
			     }
			   });
	   	};

	   	$scope.edit = function(listing) {
	   		$state.go("app.createListing", {listingId: listing.id});
	   	};


		$scope.hasMoreData = true;

		$scope.getListingsByUser = function(cb, limit, skip, sort){
			ListingService.getListingsByUser(limit, skip, sort, function (err, loadResponse) {
				console.log(err, loadResponse);
				$scope.listings = loadResponse.data ? $scope.listings.concat(loadResponse.data) : $scope.listings;
				$scope.hasMoreData = loadResponse.data && loadResponse.data.length > 0;
				
				$scope.soldListings = $filter('filter')($scope.listings, function(elem) {
					return elem.isSold === true || elem.isPrivate === true;
				});

				$scope.activeListings = $filter('filter')($scope.listings, function(elem) {
					return elem.isSold === false && elem.isPrivate === false;
				});

				$scope.loadStatus =  $scope.listings.length === 0 ? 'No listings found': '';

				console.log("Active", $scope.activeListings);
				console.log("Sold", $scope.soldListings);

	    		$scope.loadSection($scope.selection);

				if (cb) cb();
				$timeout(function () {
					ionicMaterialMotion.fadeSlideIn({
						selector: '.animate-fade-slide-in .item'
					});
				}, 200);
			});
		};

		$scope.loadSection = function(selection) {
			$scope.selection = selection;
			$scope.listings = [];
	    	switch(selection.toLowerCase()) {
	    		case 'active':
	    			angular.copy($scope.activeListings, $scope.listings);
	    			break;
    			case 'inactive':
    				angular.copy($scope.soldListings, $scope.listings);
	    			break;
	    	}
	    	$timeout(function () {
				ionicMaterialMotion.fadeSlideIn({
					selector: '.animate-fade-slide-in .item'
				});
			}, 200);
	    };

		$scope.init = function () {
			$scope.listings = [];
			$scope.pageSize = 20;
			$scope.pageNumber = 0;
			$scope.sort = "createdAt DESC";
		};

		$scope.refresh = function () {
			$scope.init();
			$scope.getListingsByUser(function () {
				$scope.$broadcast('scroll.refreshComplete');
				loadFavorites();
			}, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort);
			$scope.pageNumber = $scope.pageNumber + 1;

		};

		$scope.loadMore = function () {
			$scope.getListingsByUser(function () {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.resize');
			}, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort);
			$scope.pageNumber = $scope.pageNumber + 1;
		};

	   // Activate ink for controller
	   ionicMaterialInk.displayEffect();
	   loadFavorites();
	   $scope.init();
	}

	ctrl.$inject = ['$scope', '$state', '$timeout','ionicMaterialInk', 'ionicMaterialMotion', 'ListingService', 
	'ImageService', 'FavoritesService', '$filter', '$ionicActionSheet', '$cordovaSocialSharing', '$ionicPopup', '$ionicLoading'];
	return ctrl;

});
