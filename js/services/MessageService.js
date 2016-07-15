define(['angular'], function (angular) {
	'use strict';
	var listingService = function (HttpService, ImageService , $ionicLoading) {
		return {
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
			getUserPrivateMessages: function(cb){
				HttpService.execute('/comments/private', 'GET', null, true)
					.then(function (messageResponse) {
						cb(null, messageResponse);
					}, function (messageError) {
						cb(messageError);
					});
			},
			getMessageThread: function(parentThreadId, cb) {
				HttpService.execute('/comments/thread/' + parentThreadId, 'GET', null, true)
					.then(function (messageResponse) {
						cb(null, messageResponse);
					}, function (messageError) {
						cb(messageError);
					});
			},
			postPrivateMessage: function(message, parentId, orderId, userId, cb) {
				
				var postRequest = {
					order_id: orderId,
					message: message,
					user_id: userId,
					parentId: parentId,
					isPrivate: true
				};

				HttpService.execute('/comments/order/', 'POST', postRequest, true)
					.then(function (messageResponse) {
						cb(null, messageResponse);
					}, function (messageError) {
						cb(messageError);
					});
			}
		};
	};

	listingService.$inject = ['HttpService', 'ImageService', '$ionicLoading'];
	return listingService;
});
