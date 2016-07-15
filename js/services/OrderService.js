/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function (HttpService) {

		return {
			getMyOrders: function (userId, cb) {
				HttpService.execute('/order?sort=createdAt DESC&buyer_id=' + userId, 'GET', null, true)
					.then(function (orderResponse) {
						cb(null, orderResponse);
					}, function (orderError) {
						cb(orderError);
					});
			},
			getRequestedOrders: function(userId, cb) { 
				HttpService.execute('/order?sort=createdAt DESC&seller_id=' + userId, 'GET', null, true)
					.then(function (orderResponse) {
						cb(null, orderResponse);
					}, function (orderError) {
						cb(orderError);
					});
			},
			createOrder: function(listingId, description, cardId, customerId, notes, cb) {
				var createOrderRequest = {
					"CurrencyCode": "USD",
					"Description": description,
					"CustomerId": customerId,
					"CardId": cardId,
					"Capture": true,
					"Notes": notes,
					"ListingId": listingId
				};
				
				HttpService.execute('/api/charge/create/stripe', 'POST', createOrderRequest, true)
				.then(function(orderResponse) {
					cb(null, orderResponse);
				}, function(orderError) {
					cb(orderError);
				});
			},
			processOrderPayments: function(orderid, secretcode, cb) {
				var createOrderRequest = {
					"CurrencyCode": "USD",
					"Description": description,
					"CustomerId": customerId,
					"CardId": cardId,
					"Capture": true,
					"Notes": notes,
					"ListingId": listingId
				};
				HttpService.execute('/api/charge/create/stripe', 'POST', createOrderRequest, true)
				.then(function(orderResponse) {
					cb(null, orderResponse);
				}, function(orderError) {
					cb(orderError);
				});
			},
			cancelOrder: function(orderId, cb) {
				var cancelOrderRequest = {
					"orderId": orderId
				};
				
				HttpService.execute('/order/cancel', 'POST', cancelOrderRequest, true)
				.then(function(orderResponse) {
					cb(null, orderResponse);
				}, function(orderError) {
					cb(orderError);
				});
			},
			getOrderDetails: function(orderId, cb){
				HttpService.execute('/order/details/'+orderId, 'GET', null, true)
				.then(function(orderResponse) {
					cb(null, orderResponse);
				}, function(orderError) {
					cb(orderError);
				});
			}
		};

	};

	factory.$inject = ['HttpService'];
	return factory;
});
