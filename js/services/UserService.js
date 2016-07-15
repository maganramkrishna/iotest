/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function (HttpService, GeoLocationService, $rootScope) {
		
		function getUserInfo(userId, cb) {
			HttpService.execute('/user/'+userId, 'GET', null, true)
				.then(function (userResponse) {
					delete userResponse.passports;
					cb(null, userResponse);
				}, function (userError) {
					cb(userError);
				});
		}

		return {
			gerUserInfo: function(userId, cb){
				getUserInfo(userId, cb);
			},
			updateUser: function(userObject, cb) {
				delete userObject.passports;
				delete userObject.requestLogs;
				delete userObject.address;
				delete userObject.creditcard;
				HttpService.execute('/user/'+userObject.id, 'PUT', userObject, true)
					.then(function (userResponse) {
						cb(null, userResponse);
					}, function (userError) {
						cb(userError);
					});
			},
			updateUserAddress: function (latitude, longitude, cb){
				GeoLocationService.getAddress(latitude, longitude, function(err, addressResponse){
					console.log("GeoLocationService", addressResponse);
					var currentAddress = window.localStorage.getItem('location') ? JSON.parse(window.localStorage.getItem('location')) : null;
					if(err){
						return cb(err);
					} else if(addressResponse.data.address){
						var address = addressResponse.data.address;
						var addressRequest = {
							latitude: latitude,
							longitude: longitude,
							address1: address.road,
							address2: '',
							city: address.city,
							state: address.state,
							zipcode: address.postcode,
							user_id: window.localStorage.getItem('userId')
						};

						HttpService.execute('/address/', 'POST', addressRequest, true)
							.then(function (resp) {
								window.localStorage.setItem('location', JSON.stringify(resp.data));
								$rootScope.location = resp.data;
								getUserInfo(window.localStorage.getItem('userId'), function(err, loggedInUser) { 
									$rootScope.currentUser = !err ? loggedInUser.data : $rootScope.currentUser;
								});

								cb(null, resp);
							}, function (respErr) {
								cb(respErr);
							});
					} else {
						cb(new Error("Failed to get address information"));
					}
				});
			},
			saveDeviceToken: function(token, userId, cb) {
				var deviceTokenRequest = {
					token: token,
					user_id: userId
				};

				HttpService.execute('/devicetokens', 'POST', deviceTokenRequest, true)
					.then(function (userResponse) {						
						cb(null, userResponse);
					}, function (userError) {
						cb(userError);
					});
			},
			getDeviceTokens: function(userId, cb){
				HttpService.execute('/devicetokens?user_id=' + userId, 'GET', null, true)
					.then(function (userResponse) {						
						cb(null, userResponse);
					}, function (userError) {
						cb(userError);
					});
			},
			getCustomer: function(userId, cb) {
				HttpService.execute('/customer/?user_id='+userId, 'GET', null, true)
					.then(function (userResponse) {						
						cb(null, userResponse);
					}, function (userError) {
						cb(userError);
					});
			}
		};
	};

	factory.$inject = ['HttpService', 'GeoLocationService', '$rootScope'];
	return factory;
});
