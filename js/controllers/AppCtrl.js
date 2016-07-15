/*global define, console */

define(function () {
	'use strict';

	function ctrl($scope, $state, $rootScope, $cordovaCamera, $location, AuthenticationService, NotificationService, 
		UserService, CONFIG, ImageService, $ionicSlideBoxDelegate, $cordovaGeolocation, $ionicSideMenuDelegate, $ionicHistory) {


		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		$rootScope.IsLoggedIn = true;
		$scope.ImageService = ImageService;
		if (!AuthenticationService.isLoggedIn()) {
			$rootScope.IsLoggedIn = false;
			//$state.go('app.landing');
		}
		else {
			UserService.gerUserInfo(window.localStorage.getItem('userId'), function (err, userResponse) {
				$rootScope.currentUser = userResponse.data;
			});
			NotificationService.getUnreadNotifications(function() {});
		}

		 NotificationService.promptForRating();

		var posOptions = {
			timeout: 10000,
			enableHighAccuracy: true
		};

		$rootScope.reportAppLaunch = function(url){
			$location.path("/" + url);
		};

		 $scope.toggleLeftSideMenu = function(state) {
		 	$ionicHistory.nextViewOptions({
				disableBack: true
			});
		    $state.go(state);
		    $ionicHistory.clearHistory();
		    $ionicSideMenuDelegate.toggleLeft();
		  };

		$cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {
				var lat = position.coords.latitude;
				var long = position.coords.longitude;

				if ($rootScope.currentUser && (!$rootScope.currentUser.address || $rootScope.currentUser.address.length <= 0)) {
					UserService.updateUserAddress(lat, long, function (err, addressResponse) {
						if (err) {
							console.error(err);
						}
					});
				}
			}, function (err) {
				console.error(err);
			});

		$scope.$on('$stateChangeStart',
			function (event, toState, toParams, fromState, fromParams) {
				if (CONFIG.secureStates.indexOf(toState.url) > -1 && !$rootScope.IsLoggedIn) {
					event.preventDefault();
					$state.go('app.landing');
				}
			});

		$scope.logout = function () {
			AuthenticationService.logout(function (err, logoutResponse) {
				if (logoutResponse) {
					$rootScope.IsLoggedIn = false;
					$rootScope.currentUser = null;
					$state.go('app.landing');
					NotificationService.show("Logged out", 'short', 'center');
				}
				else {
					NotificationService.show("Failed to logout", 'long', 'center');
				}
			});
		};

	}

	ctrl.$inject = ['$scope', '$state', '$rootScope', '$cordovaCamera', '$location', 'AuthenticationService', 'NotificationService', 
	'UserService', 'CONFIG', 'ImageService', '$ionicSlideBoxDelegate', '$cordovaGeolocation', '$ionicSideMenuDelegate', '$ionicHistory'];
	return ctrl;

});
