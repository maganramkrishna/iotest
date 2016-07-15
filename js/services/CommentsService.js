	/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function (HttpService) {

		return {
			getCommentsByListing: function (listingId, cb) {
				HttpService.execute('/comments/listing/'+ listingId, 'GET', null, true)
					.then(function (commentResponse) {
						cb(null, commentResponse);
					}, function (commentError) {
						cb(commentError);
					});
			},
			postComment: function (message, listing_id, user_id, parent_id, cb) {
				var postCommentRequest = {
					'user_id': Number(user_id),
					'listing_id': listing_id,
					'message': message,
					'parentId': parent_id,
					'isPrivate': 0
				};
				HttpService.execute('/comments/', 'POST', postCommentRequest, true)
					.then(function (commentResponse) {
						cb(null, commentResponse);
					}, function (commentError) {
						cb(commentError);
					});
			},
			deleteComment: function(commentId, cb){
				HttpService.execute('/comments/'+ commentId, 'DELETE', null, true)
					.then(function (commentResponse) {
						cb(null, commentResponse);
					}, function (commentError) {
						cb(commentError);
					});
			},
			postPrivateComment: function(message, orderId, userId, parentId, cb) {
				var postCommentRequest = {
					'user_id': Number(userId),
					'order_id': orderId,
					'message': message,
					'parentId': parentId
				};
				HttpService.execute('/comments/order', 'POST', postCommentRequest, true)
					.then(function (commentResponse) {
						cb(null, commentResponse);
					}, function (commentError) {
						cb(commentError);
					});
			}
		};

	};

	factory.$inject = ['HttpService'];
	return factory;
});
