define(function () {
	'use strict';

	function ctrl($scope, $rootScope, $state, $timeout, $ionicModal, $ionicLoading, ListingService, ImageService, 
		CommentsService, FavoritesService, OrderService, PaymentService, $ionicActionSheet, $cordovaSocialSharing, $ionicPopup, $window, UserService, CONFIG) {

		$scope.hasMoreData = true;
		$scope.listingImages = [];
		$scope.comments = [];
		$scope.newcomment = {};
		$scope.cardId = null;
		$scope.currentUserId = window.localStorage.getItem('userId');
		$scope.bid = {
			new:''
		};
		console.log("CONFIG",CONFIG);
		$scope.report = {};

		var message = "Check out this posting on hotspot";
		var subject = "HotSpot App";
		var listingImage = "http://res.cloudinary.com/hotspot-online/image/upload/w_100/assets/mini-icon.jpg";
		var link = CONFIG.baseUrl + "/social/share/?listingId=";		

		$scope.$state = $state;
		
		$ionicModal.fromTemplateUrl('post.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
	    }).then(function(modal) {
		    $scope.modal = modal;
	    });


	    $scope.filterParent = function(item) {
	    	return item.parentId === 0;
	    };

	    $ionicModal.fromTemplateUrl('checkout.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
	    }).then(function(modal) {
		    $scope.checkoutModal = modal;
	    });

	    $ionicModal.fromTemplateUrl('bid.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
	    }).then(function(modal) {
		    $scope.bidModal = modal;
	    });

	    function getListings () {
	    	$ionicLoading.show();
	    	ListingService.getListing($state.params.listingId, function (err, loadResponse) {
				$scope.listing = loadResponse.data ? loadResponse.data : $scope.listing;

				link = link + $scope.listing.id;

				angular.forEach($scope.listing.images, function(image, i){
					$scope.listingImages.push(image);
				});
				if($scope.listingImages && $scope.listingImages.length > 0) {
					listingImage = ImageService.getImageByType($scope.listingImages[0].imageKey,'listing-wide');
				}

				$scope.isOwner = $scope.listing.user && $scope.listing.user.id == window.localStorage.getItem('userId');
				if($scope.listing.startDate && $scope.listing.endDate) {
					PaymentService.getBidders($scope.listing.id, function(err, bidders){
						$scope.bidders = bidders.data;
						$scope.maxBid = bidders.data.length > 0 ? Math.max.apply(Math,bidders.data.map(function(o){return o.price;})): $scope.listing.price;					
					});
				}

				UserService.gerUserInfo($scope.listing.user.id, function(err, userResponse) {
					if(!err) {
						$scope.listingUser = userResponse.data;
					}
				});

				$scope.$broadcast('imageslider:collection:updated', $scope.listingImages);
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.hide();
			});
	    }

	    $scope.refresh = function(){
	    	$scope.listingImages = [];
			$scope.comments = [];
			$scope.newcomment = {};
			$scope.cardId = null;
			$scope.currentUserId = window.localStorage.getItem('userId');
			$scope.bid = {
				new:''
			};
			$scope.report = {};
	    	getListings();
	    	$scope.getComments();
	    };
		
		$scope.$on('$ionicView.afterEnter', function() {
			getListings();
			$scope.getComments();
		});

		FavoritesService.isUsersFavoriteListing($scope.currentUserId, $state.params.listingId, function(err, favResponse){
			if(!err) {
				$scope.isFavorite = favResponse && favResponse.data.length > 0;
				$scope.listingFavorite = $scope.isFavorite ? favResponse.data[0] : {};
			}
		});

		$scope.getComments = function() {
			CommentsService.getCommentsByListing($state.params.listingId, function(err, loadResponse){
				if(err) {
					console.error(err);
				}
				$scope.comments = loadResponse.data ? loadResponse.data : $scope.comments;
			});
		};

		$scope.deleteImage = function(image, index){
			console.log("deleitng image from controller", image);
			ListingService.deleteImage(image.imageKey, function(){
				console.log("FINAL DELETE", arguments);
				$scope.listingImages.splice(index, 1);
				$scope.$broadcast('imageslider:collection:updated', $scope.listingImages);
			});
		};

		$scope.deleteComment = function(comment) {
			$ionicPopup.confirm({
				 title: 'Delete Image' ,
				 template: 'Are you sure you want to delete this image?',
				 okText: 'Yes',
				 cancelText: 'No'
			   })
			   .then(function(res) {
				 if(res) {
					CommentsService.deleteComment(comment.id, function(err, response) {
						if(!err) {
							var commentIndex = $scope.comments.indexOf(comment);
							$scope.comments.splice(commentIndex, 1);
						}
					});
				 }
		   });
		};

		$scope.postComment = function(parentId){
			if(!window.localStorage.getItem('userId')) {
				$state.go('app.login');
				return;
			}

		    $scope.modal.show();
		    var element = $window.document.getElementById('comment');
		    $timeout(function () {
		        element.focus();
		        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		          cordova.plugins.Keyboard.show(); //open keyboard manually
		        }
		    }, 350);
		    $scope.confirmPost = function(){
		    	$ionicLoading.show({
			      template: 'Posting your comment ...',
			      duration: 2000
			    });
		    	CommentsService.postComment($scope.newcomment.message, $scope.listing.id, window.localStorage.getItem('userId'), parentId || 0,
				function(err, commentResponse){
					if(!err) {
						$scope.comments.push(commentResponse.data);
						$scope.newcomment.message = '';
					} else {
						$ionicLoading.show({
					      template: err && err.data ? err.data : 'Something went wrong, please contact the support',
					      duration: 5000,
					      delay: 500
					    });
					}
					$scope.modal.hide();
				});
		    };

		    $scope.cancelPost = function() {
		    	$scope.modal.hide();
		    };
		};

		$scope.shareNative = function() {
	  		$scope.actionSheet = $ionicActionSheet.show({
			     buttons: [
			       { text: 'Facebook' },
			       { text: 'Twitter' },
			       { text: 'SMS Message' },
			       { text: 'Email' },
			       { text: 'other' }
			     ],
			     // destructiveText: '',
			     titleText: 'Share ' + $scope.listing.name,
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
 							$scope.share();
 							break;
						default:
							$scope.share();
							break;

			     	}
			       return true;
			    }
		   });
		};

		/*
		   * if given group is the selected group, deselect it
		   * else, select the given group
		   */
		$scope.toggleGroup = function(group) {
		    if ($scope.isGroupShown(group)) {
		    	$scope.shownGroup = null;
		    } else {
		    	$scope.shownGroup = group;
		    }
		};
		$scope.isGroupShown = function(group) {
		    return $scope.shownGroup === group;
		};

		$scope.toggleGroup('description');

		/******** Checkout ********/
		$scope.checkout = function() {

			if(!$rootScope.currentUser) {
				$state.go('app.login');
				return;
			}
			$scope.getPaymentMethods();
			$scope.checkoutModal.show();
		};

		$scope.cancelCheckout = function() {
			$scope.checkoutModal.hide();
		};

		$scope.cancelBid = function() {
			$scope.bidModal.hide();
		};

		$scope.bid = function() {

			if(!$rootScope.currentUser) {
				$state.go('app.login');
				return;
			}
			$scope.getPaymentMethods();
			// Check if timed out
			var eDate = moment($scope.listing.endDate);
			if(eDate.diff(moment()) < 0) {
				$ionicLoading.show({
				      template: "Listing has ended, please try later",
				      duration: 5000
				    });
				return;
			}
			$scope.bidModal.show();
			PaymentService.getBidders($scope.listing.id, function(err, bidders){
				console.log('bidders', bidders);
				if(!err) {
					var element = $window.document.getElementById('newBid');
					$timeout(function () {
				        element.focus();
				        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				          cordova.plugins.Keyboard.show(); //open keyboard manually
				        }
				      }, 350);

					$scope.bidders = bidders.data;
					$scope.maxBid = bidders.data.length > 0 ? Math.max.apply(Math,bidders.data.map(function(o){return o.price;})): $scope.listing.price;
				} else {
					$ionicLoading.show({
				      template: err && err.data ? err.data : 'Something went wrong, please contact the support',
				      duration: 5000,
				      delay: 500
				    });
				}
			});
		};

		$scope.placeBid = function() {

			if($scope.bid.new <= 0) {
				$ionicLoading.show({
			      template: 'Please add a bidding price',
			      duration: 5000
			    });
			    return;
			}
			console.log($scope.bid.new);
			PaymentService.placeBid(window.localStorage.getItem('userId'), $scope.listing.id, $scope.bid.new, function(err, bidResponse){
				if(err) {
					$ionicLoading.show({
				      template: err.data,
				      duration: 5000
				    });
				} else {
					$ionicLoading.show({
				      template: 'Bid placed successfully',
				      duration: 5000
				    });
					$scope.maxBid = angular.copy($scope.bid.new);
					$scope.bidModal.hide();
					$scope.refresh();
				}
			});
		};

		$scope.selectPaymentMethod = function(cardId) {
			$scope.cardId = cardId;
		};

		$scope.confirmOrder = function() {
			if(!$scope.cardId) {
				$ionicLoading.show({
			      template: 'Please select a card',
			      duration: 3000
			    });	
			    return;
			}
			$ionicLoading.show({
		      template: 'Processing your order ...'
		    });
			OrderService.createOrder($scope.listing.id, $scope.listing.description, $scope.cardId, $scope.customerId, $scope.notes, function(err, response){
				$ionicLoading.hide();
				console.log("ERROR", err);

				if(!err) {
					var createdOrder = response.data.Order;
					$scope.checkoutModal.hide();
					$state.go('app.orderDetails', {orderId: createdOrder.id});
				} else {
					$ionicLoading.show({
				      template: err && err.data ? err.data : 'Something went wrong, please contact the support',
				      duration: 5000,
				      delay: 500
				    });
				}
				console.log(response);
			});
		};

		$scope.getPaymentMethods = function() {
			PaymentService.getPayments(window.localStorage.getItem('userId'), function(err, paymentResponse){
				console.log("PAYMENTS", paymentResponse, typeof paymentResponse.data.InternalCards.length == "undefined");
				$scope.paymentMethods = paymentResponse.data;
				if($scope.paymentMethods.InternalCards.length === 0 || typeof $scope.paymentMethods.InternalCards.length == "undefined") {
					if (navigator.notification.confirm) {
		                navigator.notification.confirm("You do not have any payment methods setup, setup now ?", function(){
		                	$scope.checkoutModal.hide();
		                	$state.go('app.payments', {state: 'cc'});
		                }, 'Payment Methods', ['Go']);
	              	}		
	              	$scope.customerId = '';
				} else {
					$scope.customerId = paymentResponse.data.ExtCards.data.length > 0 ? paymentResponse.data.ExtCards.data[0].customer : '';	
				}
			});
		};



		/******** Social share options *********/
		$scope.share = function(){
			$cordovaSocialSharing
				.share(message, subject, [], link) // Share via native share sheet
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occured. Show a message to the user
				});
		};

		$scope.twitterShare = function(){
			$cordovaSocialSharing
				.shareViaTwitter(message + ' ' + link, listingImage, link)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
				});
		};

		$scope.facebookShare = function() {
			$cordovaSocialSharing
				.shareViaFacebook('', listingImage, link)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
					
				});
		};

		$scope.smsShare = function() {
			// access multiple numbers in a string like: '0612345678,0687654321'
			$cordovaSocialSharing
				.shareViaSMS(message + ' ' + link, "", link)
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
					console.log(err);
				});
		};

		// toArr, ccArr and bccArr must be an array, file can be either null, string or array

		$scope.emailShare = function() {
			$cordovaSocialSharing
				.shareViaEmail(message + ' ' + link + '<br><img width="100" src="' + listingImage + '" />', subject, [], [], [], [])
				.then(function (result) {
					// Success!
				}, function (err) {
					// An error occurred. Show a message to the user
				});
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
			    template: 'Are you sure you want to Report this item?<br/><br/><textarea placeholder="What would you like to report? (Optional)" ng-model="report.message"></textarea>',
			    title: 'Report ' + $scope.listing.name,
			    subTitle: 'Please provide us with some details',
			    scope: $scope,
			    buttons: [
			      { text: 'No' },
			      {
			        text: '<b>Send</b>',
			        type: 'button-positive',
			        onTap: function(e) {
			          ListingService.flagReport($scope.report.message, 'listing', $scope.listing.id, $scope.report.block, function() {
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
	}

	ctrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$ionicModal', '$ionicLoading', 'ListingService', 'ImageService', 
	'CommentsService', 'FavoritesService', 'OrderService', 'PaymentService', '$ionicActionSheet', '$cordovaSocialSharing', '$ionicPopup', '$window', 'UserService', 'CONFIG'];
	return ctrl;

});
