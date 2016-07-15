define(function () {
	'use strict';

	function ctrl($scope, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, ListingService, ImageService, FavoritesService) {

		var currentUserId = window.localStorage.getItem('userId');
		function loadFavorites(){
			if(currentUserId){
				FavoritesService.getFavoriteListings(currentUserId, function(err, favoriteList){
					console.log(err, favoriteList);
					$scope.favoriteList = err ? []: favoriteList.data;
				});
			}
		}

		$scope.hasMoreData = true;

		$scope.getFavoriteListingsByUser = function(cb, limit, skip, sort){
			ListingService.getFavoriteListingsByUser(limit, skip, sort, function (err, loadResponse) {
				console.log(err, loadResponse);
				$scope.listings = loadResponse.data ? $scope.listings.concat(loadResponse.data) : $scope.listings;
				$scope.hasMoreData = loadResponse.data && loadResponse.data.length > 0;
				$scope.showEmpty = $scope.listings.length === 0;
				if (cb) cb();
				$timeout(function () {
					ionicMaterialMotion.fadeSlideIn({
						selector: '.animate-fade-slide-in .item'
					});
				}, 200);
			});
		};

		$scope.init = function () {
			$scope.listings = [];
			$scope.pageSize = 10;
			$scope.pageNumber = 0;
			$scope.sort = "createdAt DESC";
		};

		$scope.refresh = function () {
			$scope.init();
			$scope.getFavoriteListingsByUser(function () {
				$scope.$broadcast('scroll.refreshComplete');
				loadFavorites();
			}, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort);
			$scope.pageNumber = $scope.pageNumber + 1;

		};

		$scope.loadMore = function () {
			$scope.getFavoriteListingsByUser(function () {
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

	ctrl.$inject = ['$scope', '$state', '$timeout','ionicMaterialInk', 'ionicMaterialMotion', 'ListingService', 'ImageService', 'FavoritesService'];
	return ctrl;

});
