define(function () {
	'use strict';


	function loginCtrl($scope, $state, $ionicSideMenuDelegate, $cordovaToast, $ionicHistory, $rootScope, 
		AuthenticationService, NotificationService, UserService, $ionicLoading, $cordovaFacebook) {


		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};

		if (AuthenticationService.isLoggedIn()) {
			$state.go('app.listings');
		}
		else {
			$ionicSideMenuDelegate.canDragContent(false);
		}

		$scope.goToRegister = function(){
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('app.register');
		};

		$scope.goBack = function(){
			
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$ionicHistory.goBack();
			$state.go('app.listings');
		};

		// Perform the login action when the user submits the login form
		$scope.doLogin = function (loginForm) {
			if(loginForm.$valid) {
				AuthenticationService.login($scope.loginData.username, $scope.loginData.password, function (err, loginResponse) {
					if (!err && loginResponse) {
						
						NotificationService.show("Successfully Logged in", 'short', 'bottom');
						// Avoid going back to login screen
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						if($ionicHistory.backView()) {
							$ionicHistory.goBack();
						} else {
							$state.go('app.listings');
						}
					}
					else {
						NotificationService.show("Failed to login", 'long', 'center');
					}
				});
			}
		};


        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function(authResponse, cb) {
            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
                function(response) {
                    console.log(response);
                    cb(null, response);
                },
                function(response) {
                    console.log(response);
                    cb(response);
                }
            );
        };

        // This is the success callback from the login method
        var fbLoginSuccess = function(response) {
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }

            var authResponse = response.authResponse;

            getFacebookProfileInfo(authResponse, function(err, profileInfo) {
                if (!err) {
                    
                    var email = profileInfo.email;
                    var facebookId = profileInfo.id;
                    var firstName = profileInfo.name.substr(0,profileInfo.name.indexOf(' '));
                    var lastName = profileInfo.name.substr(profileInfo.name.indexOf(' ')+1);
                    var profileImage = "https://graph.facebook.com/" + authResponse.userID + "/picture?type=large";

                    AuthenticationService.facebookLogin(email, email, firstName, lastName, facebookId, profileImage, function(err, loginResponse) {
                    	if (!err && loginResponse) {
							NotificationService.show("Successfully Logged in", 'short', 'bottom');
							// Avoid going back to login screen
							$ionicHistory.nextViewOptions({
								disableBack: true
							});
							if($ionicHistory.backView()) {
								$ionicHistory.goBack();
							} else {
								$state.go('app.listings');
							}
						}
						else {
							NotificationService.show("Failed to login", 'long', 'center');
						}

	                    $ionicLoading.hide();
	                    $state.go('app.listings');
                    });

                } else {
                    console.log('profile info fail', fail);
                }
            });
        };

        // This is the fail callback from the login method
        var fbLoginError = function(error) {
            console.log('fbLoginError', error);
            $ionicLoading.show({
                template: error || 'Failed to login via facebook',
                duration: 4000
            });

            // $ionicLoading.hide();
        };

        $scope.facebookLogin = function() {
            console.log('facebookLogin');
            facebookConnectPlugin.getLoginStatus(function(success) {
                if (success.status === 'connected') {
                    // The user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log('getLoginStatus', success);

                    // Check if we have our user saved
                    var user = {}; //UserService.getUser('facebook');

                    if (!user.userID) {
                        console.log('getting profileInfo');
                        fbLoginSuccess(success);
                    } else {
                        $state.go('app.listings');
                    }
                } else if (success.status === 'not_authorized') {
            		$ionicLoading.show({
                        template: 'Failed to login via facebook',
                        duration: 4000
                    });
                } else {

                    $ionicLoading.show({
                        template: 'Logging in...'
                    });

                    // Ask the permissions you need. You can learn more about
                    // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], fbLoginSuccess, fbLoginError);
                }
            });
        };
    }

	loginCtrl.$inject = ['$scope', '$state', '$ionicSideMenuDelegate', '$cordovaToast', '$ionicHistory', '$rootScope', 
	'AuthenticationService', 'NotificationService', 'UserService', '$ionicLoading', '$cordovaFacebook'];
	return loginCtrl;

});
