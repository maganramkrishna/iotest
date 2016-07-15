/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function (HttpService) {

		return {
			createCustomer: function (token, cb) {
				HttpService.execute('/api/customer/stripe', 'POST', {TokenId: token}, true)
					.then(function (customerResponse) {
						cb(null, customerResponse);
					}, function (customerError) {
						cb(customerError);
					});
			},
			getPayments: function(userId, cb) {
				HttpService.execute('/api/customer/cards/stripe', 'GET', null, true)
				.then(function(customerResponse) {
					cb(null, customerResponse);
				}, function(customerError) {
					cb(customerError);
				});
			},
			deleteCard: function(cardId, cb) {
				HttpService.execute('/api/customer/card/' + cardId + '/stripe', 'DELETE', null, true)
				.then(function(cardResult) {
					cb(null, cardResult);
				}, function(cardError) {
					cb(cardError);
				});
			},
			createCard: function(token, cb) {
				HttpService.execute('/api/card/stripe', 'POST', {TokenId: token}, true)
				.then(function(cardResult) {
					cb(null, cardResult);
				}, function(cardError) {
					cb(cardError);
				});
			},
			createRecipient: function(accountNumber, routingNumber, nameOnAccount, taxId, cb) {
				var recipientRequest = {
					"BankAccount": {
				    	"AccountNumber": accountNumber,
				        "RoutingNumber": routingNumber,
					    "Country": "US" 
				    },
			    	"TaxId": taxId,
				    "Name": nameOnAccount,
				    "Type": "individual" 	 
				};

				HttpService.execute('/api/recipient/stripe', 'POST', recipientRequest, true)
					.then(function (recipientResponse) {
						cb(null, recipientResponse);
					}, function (recipientError) {
						cb(recipientError);
					});
			},
			getRecipient: function(cb) {
				HttpService.execute('/api/recipient/stripe', 'GET', null, true)
					.then(function (recipientResponse) {
						cb(null, recipientResponse);
					}, function (recipientError) {
						cb(recipientError);
					});
			},
			deleteRecipient: function(cb) {
				HttpService.execute('/api/recipient/stripe', 'DELETE', null, true)
					.then(function (recipientResponse) {
						cb(null, recipientResponse);
					}, function (recipientError) {
						cb(recipientError);
					});
			},
			placeBid: function(userId, listingId, price, cb) {
				var bidRequest = {
					price: price,
					listing_id: listingId,
					bidder_id: userId
				};

				HttpService.execute('/bid/place', 'POST', bidRequest, true)
					.then(function (bidResponse) {
						cb(null, bidResponse);
					}, function (bidError) {
						cb(bidError);
					});
			},
			getBidders: function(listingId, cb){
				HttpService.execute('/bidders?listing_id=' + listingId, 'GET', null, true)
					.then(function (bidResponse) {
						cb(null, bidResponse);
					}, function (bidError) {
						cb(bidError);
					});
			}
		};

	};

	factory.$inject = ['HttpService'];
	return factory;
});
