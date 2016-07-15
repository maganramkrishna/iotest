/*global define*/

define(['angular'], function (angular) {
	"use strict";

	var directive = function (CONFIG, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicBackdrop, ImageService, $rootScope, $ionicPopup, $sce) {
		return {
			restrict:'E',
			scope: {
				images: '=',
				constructurl: '=?',
				deleteFn: '&',
				isowner: '='
			},
			templateUrl: 'templates/partials/imageslider.html',
			link: function (scope, elm, attrs) {
				console.log('$sce', $sce);
				var tempImages = scope.images;
				scope.constructurl = scope.constructurl || 1;
				scope.orgImages =[];
				scope.orgVideos =[];
				scope.images = [];
				scope.videos = [];
				angular.forEach(tempImages, function(image){
					if(scope.constructurl === 1){
						
						if(image.type === 'video') {
							scope.videos.push({
								img: ImageService.getImageByType(image.imageKey, 'listing-slide-video-thumb', image.type),
								src: $sce.trustAsResourceUrl(ImageService.getImageByType(image.imageKey, 'listing-slide-full-video', image.type, 'mp4')+ '?autoplay=false') 
							});
							scope.orgVideos.push(image);
						} else {
							scope.images.push(ImageService.getImageByType(image.imageKey, 'listing-slide-thumb', image.type || 'image'));	
							scope.orgImages.push(image);
						}
					} else {
						scope.images.push(image);
						scope.orgImages.push(image);
					}
				});


				scope.deleteImage = function(name, index){
					console.log("*****", name);
					$ionicPopup.confirm({
	 				     title: 'Delete Image' ,
	 				     template: 'Are you sure you want to delete this image?',
						 okText: 'Yes',
  				 		 cancelText: 'No'
	 				   })
					   .then(function(res) {
	 				     if(res) {
							scope.images.splice(index, 1);
							var imageKey = name.src ? scope.orgVideos[index] : scope.orgImages[index];
							console.log(imageKey);
							scope.deleteFn({ name: imageKey, index: index });
	 				     }
 				   });
				};

				// A confirm dialog
				scope.showConfirm = function() {
				   var confirmPopup = $ionicPopup.confirm({
				     title: 'Consume Ice Cream',
				     template: 'Are you sure you want to eat this ice cream?'
				   });
				   confirmPopup.then(function(res) {
				     if(res) {
				       console.log('You are sure');
				     } else {
				       console.log('You are not sure');
				     }
				   });
				};

				scope.$on('imageslider:collection:updated', function(e, collection){
					console.log("collection:updated", collection);
					scope.images = [];
					scope.videos = [];
					angular.forEach(collection, function(image){
						if(scope.constructurl === 1) {
							
							if(image.type === 'video') {
								scope.videos.push({
									img: ImageService.getImageByType(image.imageKey, 'listing-slide-video-thumb', image.type),
									src: $sce.trustAsResourceUrl(ImageService.getImageByType(image.imageKey, 'listing-slide-full-video', image.type, 'mp4') + '?autoplay=false')
								});
								scope.orgVideos.push(image);
							} else {
								scope.images.push(ImageService.getImageByType(image.imageKey, 'listing-slide-thumb', image.type || 'image'));
								scope.orgImages.push(image);
							}
						} else {
							scope.images.push(image);
							scope.orgImages.push(image);
						}
					});
					$ionicSlideBoxDelegate.update();
				});

				scope.zoomMin = 1;
				scope.showImages = function(index) {
				  scope.activeSlide = index;
				  scope.showModal('gallery-zoomview.html');
				};

				scope.showModal = function(templateUrl) {
					if(!scope.modal || (scope.modal && !scope.modal.isShown())) {
					  $ionicModal.fromTemplateUrl(templateUrl, {
					    scope: scope
					  }).then(function(modal) {
					    scope.modal = modal;
					    scope.modal.show();
					  });
					}
				};

				scope.closeModal = function() {
				  scope.modal.hide();
				  // scope.modal.remove();
				};

				scope.updateSlideStatus = function(slide) {
				  var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
				  if (zoomFactor == scope.zoomMin) {
				    $ionicSlideBoxDelegate.enableSlide(true);
				  } else {
				    $ionicSlideBoxDelegate.enableSlide(false);
				  }
				};
			}
		};
	};

	directive.$inject = ['CONFIG', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$ionicBackdrop', 'ImageService', '$rootScope', '$ionicPopup', '$sce'];
	return directive;
});
