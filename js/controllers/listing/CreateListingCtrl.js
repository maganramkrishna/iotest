define(function () {
	'use strict';

	function ctrl($state, $stateParams, $scope, $ionicPopup, $cordovaCamera, $cordovaImagePicker, $ionicLoading, 
		ListingService, ImageService, $ionicModal, CategoryService, $ionicHistory, $cordovaCapture, $cordovaDatePicker, $filter, PaymentService) {
		$scope.listing = {};
		$scope.listingImages = [];
		$scope.listingVideos = [];
		$scope.videosToDelete = [];
		$scope.imagesToDelete = [];
		$scope.videosToAdd = [];
		$scope.imagesToAdd = [];
		$scope.group = {};
		$scope.isBuyNow = true;


		// check if a recipient for payments exists
		PaymentService.getRecipient(function(err, recipientResponse) {
			if(!recipientResponse || !recipientResponse.data || !recipientResponse.data.ExternalRecipient || !recipientResponse.data.ExternalRecipient.id) {
				 var alertPopup = $ionicPopup.alert({
				     title: 'Wait, don\'t you want to get paid?',
				     template: 'Please enter your bank information, then post away !!'
				   });

				   alertPopup.then(function(res) {
				  //  	 	$ionicHistory.nextViewOptions({
						// 	disableBack: true
						// });
				     	$state.go('app.payments', {state: 'bank'});
				   });
			}
		});
			
		$scope.getListingToEdit = function(listingId) {
			$ionicLoading.show({
		      template: 'Loading listing details'
		    });
			ListingService.getListing($stateParams.listingId, function(err, listingDetails){
				if(!err) {
					$scope.listing = listingDetails.data;
					if(listingDetails.data.images) {
						$scope.listingImages = listingDetails.data.images.filter(function(img) {
							return img.type === 'image';
						}).map(function(img) {
							return ImageService.getImageByType(img.imageKey);
						});

						$scope.listingVideos = listingDetails.data.images.filter(function(img) {
							return img.type === 'video';
						}).map(function(img) {
							return ImageService.getImageByType(img.imageKey, '', 'video', 'mp4');
						});
					}

					$scope.selectedCategory = $scope.listing.category ? $scope.listing.category.name : '';
					$scope.listing.condition_id = $scope.listing.condition ? $scope.listing.condition.id : 0;
					$scope.listing.category_id = $scope.listing.category ? $scope.listing.category.id : 0;
					$scope.isBuyNow = !$scope.listing.endDate;

					if($scope.listing.startDate && $scope.listing.endDate && $stateParams.repost != "true") {
						PaymentService.getBidders($scope.listing.id, function(err, bidders){
							$scope.bidders = bidders.data;				
						});
					}
				}
				console.log("IMAGEs", $scope.listingImages);
				console.log("VIDEOs", $scope.listingVideos);
				$ionicLoading.hide();
			});
		};
		
		if($stateParams.listingId) {
			$scope.getListingToEdit($stateParams.listingId);
		}

		$scope.toggleTo = function(isBuyNow) {
			$scope.isBuyNow = isBuyNow;
			$scope.listing.startDate = !$scope.isBuyNow ? moment(new Date()).format('') : null;
		};

		$scope.showImageOptions = function(){
			// An elaborate, custom popup
			  $scope.myPopup = $ionicPopup.show({
			    template: '<ion-list><ion-item ng-click="takePicture()" style="text-align:center">Take a picture</ion-item><ion-item ng-click="selectPicture()" style="text-align:center">Select from Gallery</ion-item></ion-list>',
			    title: 'Select a option',
			    subTitle: '',
			    scope: $scope,
			    buttons: [
			      { text: 'Cancel', type: 'button-light' }
			    ]
			  });
			  $scope.myPopup.then(function(res) {
			    console.log('Tapped!', res);
			  });
		};

		$scope.selectStartDate = function() {
			  var options = {
			    date: new Date(),
			    mode: 'datetime', // or 'time'
			    minDate: new Date(),
			    allowOldDates: false,
			    allowFutureDates: true,
			    doneButtonLabel: 'DONE',
			    doneButtonColor: '#000000',
			    cancelButtonLabel: 'CANCEL',
			    cancelButtonColor: '#F2F3F4',
			    minInterval: 60
			  };

			  if($cordovaDatePicker) {
			  	 $cordovaDatePicker.show(options).then(function(date){
			        if(date) {
			        	$scope.listing.startDate = date;
			        }
			    });
			  }
		};

		$scope.selectEndDate = function() {
			  var options = {
			    date: new Date(),
			    mode: 'datetime', // or 'time'
			    maxDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
			    allowOldDates: false,
			    allowFutureDates: true,
			    doneButtonLabel: 'DONE',
			    doneButtonColor: '#000000',
			    cancelButtonLabel: 'CANCEL',
			    cancelButtonColor: '#F2F3F4',
			    minInterval: 60
			  };

			  if($cordovaDatePicker) {
			  	 $cordovaDatePicker.show(options).then(function(date){
			        if(date) {
			        	$scope.listing.endDate = date;
			        }
			    });
			  }
		};

		$scope.captureVideo = function() {
		    var options = { limit: 1, duration: 30 };

		    $cordovaCapture.captureVideo(options).then(function(videoData) {
		      // Success! Video data is here
		      $scope.listingVideos = videoData;
		      if($stateParams.listingId) {
		      	$scope.videosToAdd = videoData;
		      }
		    }, function(err) {
		      $ionicLoading.show({template: 'Failed to capture the video', duration:2000});
		    });
		};

		$scope.takePicture = function() {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.FILE_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				encodingType: Camera.EncodingType.JPEG,
			  	correctOrientation:true
			};
			$cordovaCamera.getPicture(options).then(
				function(imageData) {
					$scope.listingImages.push(imageData);
					$scope.$broadcast('imageslider:collection:updated', $scope.listingImages);
					if($stateParams.listingId) {
				      	$scope.imagesToAdd.push(imageData);
				    }
					$ionicLoading.show({template: 'Captured your picture', duration:2000});
					$scope.myPopup.close();
				},
				function(err){
					$ionicLoading.show({template: 'Failed to capture the picture', duration:2000});
				});
		};

		$scope.selectPicture = function() {
			var options = {
				quality: 100,
				maximumImagesCount: 4,
				width: 800,
			};

			$cordovaImagePicker.getPictures(options).then(
			function(results) {
				$scope.listingImages = results;
				if($stateParams.listingId) {
			      	$scope.imagesToAdd = results;
			    }
				$scope.$broadcast('imageslider:collection:updated', $scope.listingImages);
				$ionicLoading.show({template: 'Captured your picture', duration:2000});
				$scope.myPopup.close();
			},
			function(err){
				$ionicLoading.show({template: 'Failed to capture the picture', duration:2000});
			});
		};

		$scope.removeVideo = function(index) {
			$scope.videosToDelete.push($scope.listingVideos[index]);
			delete $scope.listingVideos[index];
		};

		$scope.removeImg = function(index) {
			$scope.imagesToDelete.push($scope.listingImages[index]);
			delete $scope.listingImages[index];
			console.log($scope.imagesToDelete);
		};

		$scope.clearImages = function() {
			$scope.listingImages = [];
			$scope.listingVideos = [];
		};

		$scope.validateListing = function(){
			//Perform validation
			var validationMessage = "";

			if(!$scope.listing.name) {
				validationMessage += "* Please enter a title <br />";
			} else if($scope.listing.name.length <= 3) {
				validationMessage += "* Listing title should be more than 3 characters long. <br/>";
			}	

			if(!$scope.listing.condition_id) {
				validationMessage += "* Please select a condition for your listing. <br/>";
			}

			if(!$scope.listing.category_id) {
				validationMessage += "* Please select a category for your listing. <br/>";
			}		

			if(!$scope.listing.description) {
				validationMessage += "* Please provide description for your listing. <br/>";
			}

			if(!$scope.listing.price || $scope.listing.price < 5) {
				validationMessage += "* Don't sell for free add some money more that $5. <br/>";
			}

			if(!$scope.isBuyNow && !$scope.listing.startDate) {
				validationMessage += "* Please select a start date for your listing. <br/>";	
			} else if(!$scope.isBuyNow && !$scope.listing.endDate) {
				validationMessage += "* Please select a end date for your listing. <br/>";	
			} else {
				var sDate = moment($scope.listing.startDate);
				var eDate = moment($scope.listing.endDate);	
				var days = moment.duration(eDate.diff(sDate)).asDays();
				if(days < 0) {
					validationMessage += "* Post your listing for a valid date range <br/>";	
				}
			}

			if($scope.listingImages.length === 0 && $scope.listingVideos.length === 0) {
				validationMessage += "* Please upload atleast one image or video relevant to your posting.";	
			}

			if(validationMessage) {
				$ionicLoading.show({template: validationMessage, duration: 5000});
			}
			return !validationMessage;
		};

		$scope.createListing = function(){
			if((!$stateParams.listingId || $stateParams.listingId && $stateParams.repost == "true") && $scope.listing && $scope.validateListing()) {
				// First create listing
				$ionicLoading.show({
			      template: 'Creating listing ...'
			    });
				$scope.listing.isSold = false;
				$scope.listing.isPrivate = false;
				ListingService.createListing($scope.listing, function(err, listingResponse){
					
					if(listingResponse && listingResponse.data.id) {
						// Upload images
						angular.forEach($scope.listingImages, function(image, key){
							if(image.startsWith("http")) {
								ListingService.copyListingImage(listingResponse.data.id, image, 'image', function() {

								});
							} else {
								ListingService.addListingImage(listingResponse.data.id, image, function(err){
									if(!err) {
										$ionicLoading.show({template: 'Listing posted successfully', duration: 1000});
									}
									$ionicLoading.hide();
								});
							}
						});

						angular.forEach($scope.listingVideos, function(video, key){
							if(!video.localURL && video.startsWith("http")) {
								ListingService.copyListingImage(listingResponse.data.id, video, 'video', function() {

								});
							} else {
								ListingService.addListingVideo(listingResponse.data.id, video.localURL, function(err){
									console.log("failed to upload video");
								});
							}
						});

						$ionicLoading.show({template: 'Listing sent successfully, please give us few minutes while we process it.', duration: 3000});
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('app.listings');
					} else {
						$ionicLoading.hide();
					}
				});
			} else if($stateParams.listingId && $scope.validateListing()){
				// Update listing
				ListingService.updateListing($scope.listing, function(err, listingResponse){
					
					if(listingResponse && listingResponse.data.id) {
						// Upload images
						angular.forEach($scope.imagesToAdd, function(image, key){
							if(image.startsWith("http")) {
								ListingService.copyListingImage(listingResponse.data.id, image, 'image', function() {

								});
							} else {
								ListingService.addListingImage(listingResponse.data.id, image, function(err){
									if(!err) {
										$ionicLoading.show({template: 'Listing posted successfully', duration: 1000});
									}
									$ionicLoading.hide();
								});
							}
						});

						angular.forEach($scope.videosToAdd, function(video, key){
							if(!video.localURL && video.startsWith("http")) {
								ListingService.copyListingImage(listingResponse.data.id, video, 'video', function() {

								});
							} else {
								ListingService.addListingVideo(listingResponse.data.id, video.localURL, function(err){
									
								});
							}
						});

						angular.forEach($scope.imagesToDelete, function(img, key){
							ListingService.deleteImage(img, function(err){
									
							});
						});

						angular.forEach($scope.videosToDelete, function(video, key){
							ListingService.deleteImage(video, function(err){
								
							});
						});

						$ionicLoading.show({template: 'Listing updated successfully, please give us few minutes while we process it.', duration: 3000});
						// $scope.getListingToEdit($scope.listing.id);
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('app.listings');
					} else {
						$ionicLoading.hide();
					}
				});
			}
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


		$ionicModal.fromTemplateUrl('categories.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modal = modal;
		  });

		$scope.openCategoryModal = function() {
			if(!$scope.categories) {
				CategoryService.getCategories(function (err, categoryResponse) {
					var cats = categoryResponse.data ? categoryResponse.data : $scope.categories;
					$scope.categories = cats;
					$scope.modal.show();
				});
			} else {
				$scope.modal.show();
			}
		};

		$scope.selectCategory = function(categoryId, categoryName) {
			$scope.listing.category_id = categoryId;
			$scope.selectedCategory = categoryName;
			$scope.closeCategoryModal();
		};

		$scope.closeCategoryModal = function() {
			$scope.modal.hide();
		};

		//Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

	  	$scope.showPreview = function(){
	  		$ionicPopup.show({
			    template: 'Coming soon',
			    title: 'Preview',
			    subTitle: 'This is how your posting will look',
			    scope: $scope,
			    buttons: [
			      { text: 'Cancel' },
			      {
			        text: '<b>Ok</b>',
			        type: 'button-positive',
			        onTap: function(e) {
			         
			        }
			      }
			    ]
			  });
	  	};
	}

	ctrl.$inject = ['$state', '$stateParams', '$scope', '$ionicPopup', '$cordovaCamera', '$cordovaImagePicker', '$ionicLoading', 
	'ListingService', 'ImageService', '$ionicModal', 'CategoryService', '$ionicHistory', '$cordovaCapture', '$cordovaDatePicker', '$filter', 'PaymentService'];
	return ctrl;

});
