define(function () {
	'use strict';

	function ctrl($scope, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, ListingService, ImageService, FavoritesService) {

		var currentUserId = window.localStorage.getItem('userId');
		var categoryId = $state.params.categoryId;

		///$scope.key = '';
		function loadFavorites(){
			if(currentUserId){
				FavoritesService.getFavoriteListings(currentUserId, function(err, favoriteList){
					$scope.favoriteList = err ? []: favoriteList.data;
				});
			}
		}

		$scope.hasMoreData = true;

		$scope.getListings = function(cb, key, limit, skip, sort, lat, lng){
			ListingService.getListingByCategory(categoryId, key, limit, skip, sort, lat, lng, function (err, loadResponse) {
				
				$scope.listings = loadResponse.data ? $scope.listings.concat(loadResponse.data) : $scope.listings;
				$scope.hasMoreData = loadResponse.data && loadResponse.data.length > 0;
				$scope.showEmpty = $scope.listings.length === 0;
				if(loadResponse.data.length === 0) {
					$scope.loadStatus = "No listings found";
				}
				if (cb) cb();
				$timeout(function () {
					ionicMaterialMotion.fadeSlideIn({
						selector: '.animate-fade-slide-in .item'
					});
				}, 200);
			});
		};

		$scope.search = function(){
			if($scope.search.key) {
				$scope.refresh();
			}
		};

		$scope.init = function () {
			$scope.listings = [];
			$scope.pageSize = 10;
			$scope.pageNumber = 0;
			$scope.search.key = $scope.search.key || '';
			var latLng = JSON.parse(window.localStorage.getItem('location'));
			$scope.lat = latLng ? latLng.latitude : 0;
			$scope.lng = latLng ? latLng.longitude : 0;
			$scope.sort = "createdAt DESC";
		};

		$scope.refresh = function () {
			$scope.init();
			$scope.getListings(function () {
				$scope.$broadcast('scroll.refreshComplete');
				loadFavorites();
			}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
			$scope.pageNumber = $scope.pageNumber + 1;

		};

		$scope.loadMore = function () {
			$scope.getListings(function () {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.resize');
			}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
			$scope.pageNumber = $scope.pageNumber + 1;
		};

	   // Activate ink for controller
	   ionicMaterialInk.displayEffect();
	   loadFavorites();
	   $scope.init();
	}

	ctrl.$inject = ['$scope', '$state', '$timeout','ionicMaterialInk', 'ionicMaterialMotion', 'ListingService', 'ImageService', 'FavoritesService'];
	return ctrl;

});
