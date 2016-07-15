define(function () {
	'use strict';

	var controlDependencies = ['$scope', '$state', '$ionicSideMenuDelegate', '$cordovaToast', '$ionicHistory',
	'$timeout', '$rootScope', '$cordovaCamera', '$ionicPopup', '$cordovaImagePicker', '$ionicLoading', '$ionicModal',
	'ionicMaterialInk', 'ionicMaterialMotion', 'UserService', 'NotificationService', 'ImageService', 'SMSService'];

	function userCtrl($scope, $state, $ionicSideMenuDelegate, $cordovaToast, $ionicHistory, $timeout,
		$rootScope, $cordovaCamera, $ionicPopup, $cordovaImagePicker, $ionicLoading, $ionicModal,
		ionicMaterialInk, ionicMaterialMotion, UserService, NotificationService, ImageService, SMSService) {

		$scope.ImageService = ImageService;
		//$scope.enteredCode = null;
		UserService.gerUserInfo(window.localStorage.getItem('userId'), function(err, userResponse){
			$scope.currentUser = userResponse.data;
			$scope.initialPhone = $scope.currentUser.phonenumber;
		});


		function doUpdate() {
			$ionicLoading.show({template: 'Updating user', duration:1000});
			UserService.updateUser($scope.currentUser, function(err){
				if(err) {
					console.log(err);
					NotificationService.show("Failed to update the user", 'short', 'bottom');
				} else {
					NotificationService.show("Profile updated successfully", 'short', 'bottom');
				}
				$rootScope.currentUser = $scope.currentUser;
			});
		}

		$scope.group = false;

		$ionicModal.fromTemplateUrl('templates/partials/phoneVerification.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		function phoneVerification (){
			$scope.modal.show();
		}


		$scope.closeVerification = function(){
			$scope.modal.hide();
		};


		$scope.verifyCode = function(enteredCode){
			console.log("VIDEO_CONTROL_FULLSCREEN", enteredCode, arguments);
			if(enteredCode === $scope.verificationCode) {
				$scope.currentUser.phoneVerified = true;
				$scope.closeVerification();
				doUpdate();
			} else {
				$ionicLoading.show({template: 'Invalid code', duration:500});
			}
		};

		$scope.sendVerification = function(cb) {
			$scope.verificationCode = Math.random().toString(36).substr(2, 5);

			SMSService.sendVerificationMessage($scope.currentUser.phonenumber, $scope.verificationCode, function(err, smsResponse) {
				if(!err) {
					phoneVerification();
				}
				if(cb) cb(err, smsResponse);
			});
		};

		$scope.updateUser = function(){
			if($scope.currentUser.phonenumber !== $scope.initialPhone) {
				if($scope.currentUser.phonenumber.substring(0,1) != 1) {
					// Add country code
					$scope.currentUser.phonenumber = '1' + $scope.currentUser.phonenumber;
				}
				$scope.currentUser.phoneVerified = false;
				$ionicLoading.show({template: 'You should receive a phone verification code shortly', duration:1000});
				$scope.sendVerification(function(err, smsResponse){
					if(!err)
						phoneVerification();
					else {
						$ionicLoading.show({template: 'Invalid phone number', duration:500});
					}
				});

			} else {
				doUpdate();
			}
		};


		$scope.showImageOptions = function(){
			// An elaborate, custom popup
			  var myPopup = $ionicPopup.show({
			    template: '<ion-list><ion-item ng-click="takePicture()" style="text-align:center">Take a picture</ion-item><ion-item ng-click="selectPicture()" style="text-align:center">Select from Gallery</ion-item></ion-list>',
			    title: 'Select a option',
			    subTitle: 'How would you like to upload a picture?',
			    scope: $scope,
			    buttons: [
			      { text: 'Cancel', type: 'button-light' }
			    ]
			  });
			  myPopup.then(function(res) {
			    console.log('Tapped!', res);
			  });
		};

		$scope.takePicture = function() {
			var options = {
				quality: 60,
				destinationType: Camera.DestinationType.FILE_URL,
				sourceType: Camera.PictureSourceType.CAMERA
			};
			/* jshint ignore:start */
			$cordovaCamera.getPicture(options).then(
				function(imageData) {
					ImageService.upload(imageData, Math.random().toString(36).substring(7), window.localStorage.getItem('userId')).then(function(uploadedImageRes){
						$scope.currentUser.profileImage = uploadedImageRes.public_id;
						$scope.updateUser();
						$cordovaCamera.cleanup();
					}, function(){
						console.log(arguments);
					});
					$ionicLoading.show({template: 'Picture saved', duration:500});
				},
				function(err){
					$ionicLoading.show({template: 'Failed to save profile picture', duration:500});
				});
			/* jshint ignore:end */
		};

		$scope.selectPicture = function() {
			var options = {
				quality: 90,
				maximumImagesCount: 1
			};
			/* jshint ignore:start */
			$cordovaImagePicker.getPictures(options).then(
			function(results) {
				for (var i = 0; i < results.length; i++) {
					ImageService.upload(results[i], Math.random().toString(36).substring(7), window.localStorage.getItem('userId')).then(function(uploadedImageRes){
						$scope.currentUser.profileImage = uploadedImageRes.public_id;
						$scope.updateUser();
					}, function(){
						console.log(arguments);
					});
		    	}
				$ionicLoading.show({template: 'Picture saved', duration:500});
			},
			function(err){
				$ionicLoading.show({template: 'Failed to save profile picture', duration:500});
			});
			/* jshint ignore:end */
		};

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
