define(function () {
	'use strict';


	function shareCtrl($scope, $cordovaSocialSharing, $ionicActionSheet) {

		var message = "Join me on Hotspot and lets make a better and safe community for buying and selling";
		var subject = "hotspot App";
		var image = "http://res.cloudinary.com/hotspot-online/image/upload/w_100/assets/mini-icon.jpg";
		var link ="http://hotspot.online";
		var file = "";
		var number = "";
		var toArr = [];
		var ccArr = [];
		var bccArr = [];

		$scope.showActionSheet = function(){
			$scope.actionSheet = $ionicActionSheet.show({
			     buttons: [
			       { text: 'Facebook' },
			       { text: 'Twitter' },
			       { text: 'SMS Message' },
			       { text: 'Email' },
			       { text: 'Whatsapp' }
			     ],
			     // destructiveText: '',
			     titleText: 'Share the hotspot app',
			     cancelText: 'Cancel',
			     cancel: function() {
			          // add cancel code..
			        },
			     buttonClicked: function(index) {
			     	switch(index) {
			     		case 0: 
			     			$scope.facebookShare();
			     			break;
		     			case 1: 
		     				$scope.twitterShare();
		     				break;
	     				case 2: 
	     					$scope.smsShare();
	     					break;
     					case 3:
     						$scope.emailShare();
     						break;
 						case 4:
 							$scope.whatsappShare();
 							break;
						default:
							$scope.share();
							break;

			     	}
			       return true;
			    }
		   });
		};

		


		$scope.share = function(){
			message = message + ' ' + link;
			$cordovaSocialSharing
				.share(message, subject, file, link) // Share via native share sheet
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occured. Show a message to the user
				});
		};

		$scope.twitterShare = function(){
			$cordovaSocialSharing
				.shareViaTwitter(message + ' ' + link, image, link)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
				});
		};

		$scope.whatsappShare = function() {
			$cordovaSocialSharing
				.shareViaWhatsApp(message + ' ' + link, image, link)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
				});
		};

		$scope.facebookShare = function() {
			$cordovaSocialSharing
				.shareViaFacebook('', image, link)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
				});
		};

		$scope.smsShare = function() {
			// access multiple numbers in a string like: '0612345678,0687654321'
			$cordovaSocialSharing
				.shareViaSMS(message + ' ' + link, number, link)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
				});
		};

		// toArr, ccArr and bccArr must be an array, file can be either null, string or array

		$scope.emailShare = function() {
			$cordovaSocialSharing
				.shareViaEmail(message + ' ' + link, subject, toArr, ccArr, bccArr, file)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
				});
		};

		$scope.canEmailShare = function() {
			$cordovaSocialSharing
				.canShareViaEmail()
				.then(function (result) {
					// Yes we can
				}, function (err) {
					// Nope
				});
		};
	}

	shareCtrl.$inject = ['$scope', '$cordovaSocialSharing', '$ionicActionSheet'];
	return shareCtrl;

});
