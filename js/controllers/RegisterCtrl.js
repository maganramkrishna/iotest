define(function () {
	'use strict';


	function loginCtrl($scope, $state, $ionicSideMenuDelegate, $cordovaToast, $ionicHistory, AuthenticationService, NotificationService) {
		// Form data for the login modal
		$scope.registerData = {
			agreement: false
		};

		if (AuthenticationService.isLoggedIn()) {
			//$state.go('app.listings');
		}
		else {
			$ionicSideMenuDelegate.canDragContent(false);
		}

		$scope.goToLogin = function() {
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('app.login');
		};

		$scope.goBack = function(){
			$ionicHistory.goBack();
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('app.listings');
		};

		$scope.toggleAgreement = function() {
			$scope.registerData.agreement = !$scope.registerData.agreement;
		};

		// Perform the login action when the user submits the login form
		$scope.doRegister = function (registerForm) {
			if(registerForm.$valid) {
				AuthenticationService.signUp($scope.registerData.username, $scope.registerData.password,
					$scope.registerData.email, $scope.registerData.firstName, $scope.registerData.lastName, function (err, loginResponse) {
					if (!err && loginResponse) {
						NotificationService.show("Successfully Logged in", 'short', 'bottom');
						// Avoid going back to login screen
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('app.listings');
					}
					else {
						var errorMessage = 'Failed to register';
						if(err.data.indexOf('A record with that `username` already exists') !== -1) {
							errorMessage = 'A record with '+ $scope.registerData.username +' already exists';
						} else if(err.data.indexOf('A record with that `email` already exists') !== -1) {
							errorMessage = 'A record with '+ $scope.registerData.email +' already exists';
						}
						NotificationService.show(errorMessage, 'long', 'center');
					}
				});
			}
		};
	}

	loginCtrl.$inject = ['$scope', '$state', '$ionicSideMenuDelegate', '$cordovaToast', '$ionicHistory', 'AuthenticationService', 'NotificationService'];
	return loginCtrl;

});
