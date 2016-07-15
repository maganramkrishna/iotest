define(['angular'], function (angular) {
	'use strict';
	var favoriteService = function (HttpService, ImageService , $ionicLoading) {
		return {
			addFavoriteListing: function(userId, listingId, cb) {
				var favListingRequest = {
					user_id: userId,
					favorites_listing_id: listingId
				};
				HttpService.execute('/favoriteslisting', 'POST', favListingRequest, true)
					.then(function (favListingResponse) {
						cb(null, favListingResponse);
					}, function (favListingError) {
						cb(favListingError);
					});
			},
			addFavoriteUser: function(userId, favoriteUserId, cb) {
				var favUserRequest = {
					user_id: userId,
					favorites_user_id: favoriteUserId
				};
				HttpService.execute('/favoritesuser', 'POST', favUserRequest, true)
					.then(function (favUserResponse) {
						cb(null, favUserResponse);
					}, function (favUserError) {
						cb(favUserError);
					});
			},
			unFavoriteListing: function(favId, cb) {
				HttpService.execute('/favoriteslisting/'+favId, 'DELETE', null, true)
					.then(function (favListingResponse) {
						cb(null, favListingResponse);
					}, function (favListingError) {
						cb(favListingError);
					});
			},
			unFavoriteUser: function(favId, cb) {
				HttpService.execute('/favoritesuser/'+favId, 'DELETE', null, true)
					.then(function (favUserResponse) {
						cb(null, favUserResponse);
					}, function (favUserError) {
						cb(favUserError);
					});
			},
			getFavoriteListings: function(userId, cb) {
				HttpService.execute('/favoriteslisting/user/'+userId, 'GET', null, true)
					.then(function (favListingResponse) {
						cb(null, favListingResponse);
					}, function (favListingError) {
						cb(favListingError);
					});
			},
			getFavoriteUsers: function(userId, cb) {
				HttpService.execute('/favoritesuser/user/'+userId, 'GET', null, true)
					.then(function (favUserResponse) {
						cb(null, favUserResponse);
					}, function (favUserError) {
						cb(favUserError);
					});
			},
			isUsersFavoriteListing: function(userId, listingId, cb) {
				HttpService.execute('/favoriteslisting/isfavorite/'+userId + '/' + listingId, 'GET', null, true)
					.then(function (favUserResponse) {
						cb(null, favUserResponse);
					}, function (favUserError) {
						cb(favUserError);
					});
			}
		};

	};

	favoriteService.$inject = ['HttpService', 'ImageService', '$ionicLoading'];
	return favoriteService;
});
