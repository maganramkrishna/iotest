define(function () {
	'use strict';

	function ctrl($scope, $rootScope, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, ListingService, 
		ImageService, FavoritesService, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading) {

		var currentUserId = window.localStorage.getItem('userId');
		$scope.$state = $state;
		$scope.search = {};
		$scope.showEmpty = false;
		///$scope.key = '';
		function loadFavorites(){
			if(currentUserId){
				FavoritesService.getFavoriteListings(currentUserId, function(err, favoriteList){
					$scope.favoriteList = err ? []: favoriteList.data;
				});
			}
		}

		$scope.showListView = window.localStorage.getItem('showListView') === 'true' || false;

		$scope.toggleViews = function() {
			$scope.showListView = !$scope.showListView;	
			window.localStorage.setItem('showListView', $scope.showListView);
			$ionicSlideBoxDelegate.update();		
		};

		$scope.hasMoreData = true;

		$scope.getListings = function(cb, key, limit, skip, sort, lat, lng) {
			ListingService.getListings(key, limit, skip, sort, lat, lng, function (err, loadResponse) {
				console.log(err, loadResponse);
				$ionicLoading.hide();
				$scope.listings = loadResponse && loadResponse.data ? $scope.listings.concat(loadResponse.data) : $scope.listings;
				$scope.hasMoreData = loadResponse && loadResponse.data && loadResponse.data.length > 0;
				if(loadResponse.data.length === 0) {
					$scope.loadStatus = "No listings found";
				}
				if (cb) cb();
				$timeout(function () {
					$scope.showEmpty = $scope.listings.length === 0;
					$scope.$apply();
				}, 1000);
			});
		};

		$scope.daysRemaining = function() {
			return "ending now";
		};

		$scope.searchData = function(){
			if($scope.search.key) {
				$scope.refresh();
			}
		};

		$scope.clearSearch = function() {
			$scope.search.key = "";
			$scope.refresh();
		};

		$scope.init = function () {
			$scope.listings = [];
			$scope.pageSize = 30;
			$scope.pageNumber = 0;
			$scope.search.key = $scope.search.key || '';
			var latLng = JSON.parse(window.localStorage.getItem('location'));
			$scope.lat = latLng ? latLng.latitude : 0;
			$scope.lng = latLng ? latLng.longitude : 0;
			$scope.sort = "createdAt DESC";
		};

		$scope.refresh = function () {
			$scope.init();
			$ionicLoading.show();
			if($scope.lat === 0 && $scope.lng === 0) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$scope.lat = position.coords.latitude;
					$scope.lng = position.coords.longitude;
					$scope.getListings(function () {
						$scope.$broadcast('scroll.refreshComplete');
						loadFavorites();
					}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
					$scope.pageNumber = $scope.pageNumber + 1;
				},function() {
					$scope.getListings(function () {
						$scope.$broadcast('scroll.refreshComplete');
						loadFavorites();
					}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
					$scope.pageNumber = $scope.pageNumber + 1;
				},{timeout:10000});
			} else {
				$scope.getListings(function () {
					$scope.$broadcast('scroll.refreshComplete');
					loadFavorites();
				}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
				$scope.pageNumber = $scope.pageNumber + 1;
			}
		};

		$scope.loadMore = function () {
			if($scope.lat === 0 && $scope.lng === 0) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$scope.lat = position.coords.latitude;
					$scope.lng = position.coords.longitude;
					$scope.getListings(function () {
						$scope.$broadcast('scroll.refreshComplete');
						loadFavorites();
					}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
					$scope.pageNumber = $scope.pageNumber + 1;
				},function() {
					$scope.getListings(function () {
						$scope.$broadcast('scroll.refreshComplete');
						loadFavorites();
					}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
					$scope.pageNumber = $scope.pageNumber + 1;
				},{timeout:10000});
			} else {
				$scope.getListings(function () {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.resize');
				}, $scope.search.key, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort, $scope.lat, $scope.lng);
				$scope.pageNumber = $scope.pageNumber + 1;
			}
		};

	   // Activate ink for controller
	   // ionicMaterialInk.displayEffect();
	   loadFavorites();
	   $scope.init();
	}

	ctrl.$inject = ['$scope', '$rootScope', '$state', '$timeout','ionicMaterialInk', 'ionicMaterialMotion', 'ListingService', 
	'ImageService', 'FavoritesService', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$ionicLoading'];
	return ctrl;

});
