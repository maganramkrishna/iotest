define(function () {
	'use strict';

	var controlDependencies = ['$scope', '$state', '$ionicSideMenuDelegate', '$cordovaToast', '$ionicHistory',
	'$timeout', '$rootScope', '$cordovaCamera', '$ionicPopup', '$cordovaImagePicker', '$ionicLoading', '$ionicModal',
	'ionicMaterialInk', 'ionicMaterialMotion', 'UserService', 'FavoritesService', 'ImageService', 'ListingService', '$filter'];

	function userCtrl($scope, $state, $ionicSideMenuDelegate, $cordovaToast, $ionicHistory, $timeout,
		$rootScope, $cordovaCamera, $ionicPopup, $cordovaImagePicker, $ionicLoading, $ionicModal,
		ionicMaterialInk, ionicMaterialMotion, UserService, FavoritesService, ImageService, ListingService, $filter) {

		// Init variables
		$scope.ImageService = ImageService;
		$scope.userId = $state.params.userId;
		$scope.hasMoreData = true;
		$scope.selection = 'live';
		$scope.report = {};
		var currentUserId = window.localStorage.getItem('userId');

		/**
		 * Load favorites for the current user
		 * @return {[type]} [description]
		 */
		function loadFavorites(){
			if(currentUserId){
				FavoritesService.getFavoriteListings(currentUserId, function(err, favoriteList){
					$scope.favoriteList = err ? []: favoriteList.data;
				});
			}
		}

		/**
		 * @method  getUserInfo
		 *          Obtaind the user information
		 * @param  {integer} userId   		user identifier
		 * @param  {function} callback		callback function
		 * @return {[type]}                               [description]
		 */
		UserService.gerUserInfo($scope.userId, function(err, userResponse){
			$scope.user = userResponse.data;
			console.log($scope.user);
			$scope.initialPhone = $scope.user.phonenumber;
		});

		$scope.getListings = function(cb, limit, skip, sort){
			ListingService.getListingsByUserId($scope.userId, limit, skip, sort, function (err, loadResponse) {
				
				$scope.listings = loadResponse.data ? $scope.listings.concat($filter('filter')(loadResponse.data, function(item) {
					if(!item.isPrivate && !item.isSold) {
						return item;
					}
				})) : $scope.listings;
				
				$scope.hasMoreData = loadResponse.data && loadResponse.data.length > 0;
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
			$scope.getListings(function () {
				$scope.$broadcast('scroll.refreshComplete');
				loadFavorites();
			}, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort);
			$scope.pageNumber = $scope.pageNumber + 1;

		};

		$scope.loadMore = function () {
			$scope.getListings(function () {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.resize');
			}, $scope.pageSize, ($scope.pageNumber) * $scope.pageSize, $scope.sort);
			$scope.pageNumber = $scope.pageNumber + 1;
		};

		$scope.showConfirmReport = function() {
			if(!window.localStorage.getItem("userId")) {
				var alertPopup = $ionicPopup.alert({
				     title: 'login',
				     template: 'You must sign in before reporting an item'
				   });

				   alertPopup.then(function(res) {

				   });
				 return;
			}
			$ionicPopup.show({
			    templateUrl: 'templates/partials/reportuser.html',
			    title: 'Want to report ' + $scope.user.firstName + '?',
			    subTitle: 'Please provide us with some details',
			    scope: $scope,
			    buttons: [
			      { text: 'No' },
			      {
			        text: '<b>Send</b>',
			        type: 'button-positive',
			        onTap: function(e) {
			          ListingService.flagReport($scope.report.message, 'user', $scope.user.id, $scope.report.block, function() {
			          		$ionicLoading.show({
						      template: "Your request has been submitted. Action will be taken within 24 hours.",
						      duration: 3000
						    });
			          });
			        }
			      }
			    ]
			})
			.then(function(res) {
			    console.log('Tapped!', res);
			});
		};

	   loadFavorites();
	   $scope.init();
		

		// Set Motion
	    $timeout(function() {
	        ionicMaterialMotion.slideUp({
	            selector: '.slide-up'
	        });
	    }, 300);

	    // Set Ink
	    ionicMaterialInk.displayEffect();
	}

	userCtrl.$inject = controlDependencies;
	return userCtrl;
});
