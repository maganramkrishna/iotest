define(['angular'], function (angular) {
	'use strict';
	var listingService = function (HttpService, ImageService , $ionicLoading) {
		return {
			getListing: function(listingId, cb) {
				HttpService.execute('/listing/'+ listingId, 'GET', null, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			getListings: function(key, limit, skip, sort, lat, lng, cb){
				HttpService.execute('/listings/search?limit=' + limit + '&skip=' + skip + '&sort=' + sort + '&key=' + key + '&lat=' + lat + '&lng=' + lng, 'GET', null, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			getListingsByUser: function(limit, skip, sort, cb){
				HttpService.execute('/listings/user/' + window.localStorage.getItem('userId') + '?limit=' + limit + '&skip=' + skip + '&sort=' + sort, 'GET', null, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			getListingsByUserId: function(userid, limit, skip, sort, cb){
				HttpService.execute('/listings/user/' + userid + '?limit=' + limit + '&skip=' + skip + '&sort=' + sort, 'GET', null, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			getFavoriteListingsByUser: function(limit, skip, sort, cb){
				HttpService.execute('/listings/favorite/user/' + window.localStorage.getItem('userId') + '?limit=' + limit + '&skip=' + skip + '&sort=' + sort, 'GET', null, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			createListing: function(createListingRequest, cb) {
				delete createListingRequest.category;
				delete createListingRequest.images;
				delete createListingRequest.user;
				delete createListingRequest.id;

				createListingRequest.user_id = Number(window.localStorage.getItem('userId'));
				HttpService.execute('/listing', 'POST', createListingRequest, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			updateListing: function(updateListingRequest, cb) {
				updateListingRequest.user_id = Number(window.localStorage.getItem('userId'));
				delete updateListingRequest.category;
				delete updateListingRequest.images;
				delete updateListingRequest.user;
				HttpService.execute('/listing/' + updateListingRequest.id, 'PUT', updateListingRequest, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			addListingImage: function(listingId, image, cb){
				ImageService.upload(image, Math.random().toString(36).substring(7), listingId + '/' + window.localStorage.getItem('userId'))
				.then(function(listingImageResponse){
					//$ionicLoading.show({template: 'Uploaded Image ', duration:500});
					var listingImageRequest = {
						"listing_id": listingId,
						"type": 'image'
					};
					listingImageRequest.imageKey = listingImageResponse.public_id;
					console.log(listingImageRequest);
					HttpService.execute('/listingImages', 'POST', listingImageRequest, true)
						.then(function (listingResponse) {
							cb(null, listingResponse);
						}, function (listingError) {
							cb(listingError);
						});

				}, function(err){
					$ionicLoading.show({template: 'Error uploading image', duration:1000});
				});

			},
			addListingVideo: function(listingId, video, cb) {
				ImageService.uploadVideo(video, Math.random().toString(36).substring(7), listingId + '/' + window.localStorage.getItem('userId'))
				.then(function(listingImageResponse){
					//$ionicLoading.show({template: 'Uploaded Image ', duration:500});
					var listingImageRequest = {
						"listing_id": listingId,
						"type": 'video'
					};
					listingImageRequest.imageKey = listingImageResponse.public_id;
					console.log('listingImageResponse', listingImageResponse);
					HttpService.execute('/listingImages', 'POST', listingImageRequest, true)
						.then(function (listingResponse) {
							cb(null, listingResponse);
						}, function (listingError) {
							cb(listingError);
						});

				}, function(err){
					$ionicLoading.show({template: 'Error uploading image', duration:1000});
				});
			},
			copyListingImage: function(listingId, fromId, type, cb) {
				// if(fromId.endsWith(".png") || fromId.endsWith(".mp4")) {
				// 	fromId = fromId.split('.')[0];
				// }
				var request = {
					"imageUrl": fromId,
					"to_public_id": listingId + '/' + window.localStorage.getItem('userId') + '/' + Math.random().toString(36).substring(7),
					"resource_type": type
				};

				HttpService.execute('/image/upload', 'POST', request, true)
					.then(function (listingImageResponse) {
						var listingImageRequest = {
							"listing_id": listingId,
							"type": type
						};
						listingImageRequest.imageKey = listingImageResponse.data.public_id;
						console.log('listingImageResponse', listingImageResponse);
						HttpService.execute('/listingImages', 'POST', listingImageRequest, true)
							.then(function (listingResponse) {
								cb(null, listingResponse);
							}, function (listingError) {
								cb(listingError);
							});
					}, function (listingError) {
						cb(listingError);
					});
			},
			deleteImage: function(imageKey, cb){
				HttpService.execute('/listing/image/', 'DELETE', { key: imageKey}, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			getUserMessages: function(userId, cb){
				HttpService.execute('/comments/user/' + userId, 'GET', null, true)
					.then(function (messageResponse) {
						cb(null, messageResponse);
					}, function (messageError) {
						cb(messageError);
					});
			},
			getUserListingsMessages: function(userId, cb){
				HttpService.execute('/comments/userlisting/' + userId, 'GET', null, true)
					.then(function (messageResponse) {
						cb(null, messageResponse);
					}, function (messageError) {
						cb(messageError);
					});
			},
			searchListings: function(key, limit, skip, sort, cb) {
				HttpService.execute('/listings/search/?key=' + key + '&limit=' + limit + '&skip=' + skip + '&sort=' + sort, 'GET', null, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			getListingByCategory: function(categoryId, key, limit, skip, sort, lat, lng, cb) {
				HttpService.execute('/listings/search/?key=' + key + '&category_id='+ categoryId+ '&limit=' + limit + '&skip=' + skip + '&sort=' + sort+  '&lat=' + lat + '&lng=' + lng, 'GET', null, true)
					.then(function (listingResponse) {
						cb(null, listingResponse);
					}, function (listingError) {
						cb(listingError);
					});
			},
			flagReport: function(message, type, referenceId, block, cb) {
				var reportRequest = {
					reporter_id: window.localStorage.getItem('userId'),
					message: message,
					referenceId: referenceId,
					type: type,
					block: block || false
				};
				HttpService.execute('/flagreports/', 'POST', reportRequest, true)
					.then(function (userResponse) {						
						cb(null, userResponse);
					}, function (userError) {
						cb(userError);
					});
			}
		};

	};

	listingService.$inject = ['HttpService', 'ImageService', '$ionicLoading'];
	return listingService;
});
