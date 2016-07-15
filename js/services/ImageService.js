/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function ($q, $ionicLoading, $cordovaFileTransfer, CONFIG, $http) {
		var fileSize;
		var percentage;


		/**
		 * @private File upload method to upload images to cloudinary
		 **/
		function uploadFile(imageURI, name, folder, deferred) {
			// Add the Cloudinary "upload preset" name to the headers
			var uploadOptions = {
				params: {
					'upload_preset': CONFIG.cloudinary.UPLOAD_PRESET,
					'public_id': name,
					'folder': folder,
					"resource_type": "image"
				}
			};

			$cordovaFileTransfer
				.upload(CONFIG.cloudinary.API_URL, imageURI, uploadOptions)

			.then(function (result) {
				// Let the user know the upload is completed
				// $ionicLoading.show({
				// 	template: 'Upload Completed',
				// 	duration: 1000
				// });
				// Result has a "response" property that is escaped
				// FYI: The result will also have URLs for any new images generated with
				// eager transformations
				var response = JSON.parse(decodeURIComponent(result.response));
				
				deferred.resolve(response);
			}, function (err) {
				// Uh oh!
				$ionicLoading.show({
					template: 'Upload Failed',
					duration: 3000
				});
				deferred.reject(err);
			}, function (progress) {
				// The upload plugin gives you information about how much data has been transferred
				// on some interval.  Use this with the original file size to show a progress indicator.
				percentage = Math.floor(progress.loaded / fileSize * 100);
				// $ionicLoading.show({
				// 	template: 'Uploading Picture : ' + percentage + '%'
				// });
			});
		}

		function uploadVideoFile(videoURI, name, folder, deferred) {
			// Add the Cloudinary "upload preset" name to the headers
			var uploadOptions = {
				params: {
					'upload_preset': CONFIG.cloudinary.UPLOAD_PRESET,
					'public_id': name,
					'folder': folder,
					"resource_type": "video"
				}
			};

			$cordovaFileTransfer
				.upload(CONFIG.cloudinary.API_VIDEO_URL, videoURI, uploadOptions)

			.then(function (result) {
				var response = JSON.parse(decodeURIComponent(result.response));
				deferred.resolve(response);
			}, function (err) {
				$ionicLoading.show({
					template: 'Upload Failed',
					duration: 3000
				});
				deferred.reject(err);
			}, function (progress) {

			});
		}

		return {
			upload: function (imageURI, name, folder) {
				var deferred = $q.defer();
				// Find out how big the original file is
				window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
					fileEntry.file(function (fileObj) {
						fileSize = fileObj.size;
						
						// Trigger the upload
						uploadFile(imageURI, name, folder, deferred);
					});
				});
				return deferred.promise;
			},
			getImageByType: function (name, imageType, sourceType, extension) {
				sourceType = sourceType || 'image';
				name = name || CONFIG.defaultImage;
				var imageTypeSize = CONFIG.cloudinary.resizeParams[imageType];
				var baseUrl = sourceType === 'video' ? CONFIG.cloudinary.BASE_VIDEO_URL : CONFIG.cloudinary.BASE_IMAGE_URL;
				if(imageTypeSize) {
					return  baseUrl + imageTypeSize + '/' + name + (extension ? '.' + extension : '.png');
				} else {
					return  baseUrl + '/' + name + (extension ? '.' + extension : '.png');
				}
			},
			deleteImage: function(public_id, cb){
				var deleteRequest = {
					public_id: public_id,
					api_key: CONFIG.cloudinary.API_KEY,
					timestamp: new Date()
				};
				$http(deleteRequest)
				.then(function(){
					console.log('SUCEESS', arguments);
				}, function(err){
					console.error(err);
				});
			},
			uploadVideo: function(videoURI, name, folder) {
				var deferred = $q.defer();
				// Find out how big the original file is
				window.resolveLocalFileSystemURL(videoURI, function (fileEntry) {
					fileEntry.file(function (fileObj) {
						fileSize = fileObj.size;
						uploadVideoFile(videoURI, name, folder, deferred);
					});
				});
				return deferred.promise;
			}
		};
	};

	factory.$inject = ['$q', '$ionicLoading', '$cordovaFileTransfer', 'CONFIG', '$http'];
	return factory;
});
