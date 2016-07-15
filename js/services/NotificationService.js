define(['angular'], function (angular) {
	'use strict';
	var notification = function ($http, $cordovaToast, HttpService, $rootScope, $ionicPopup) {
		return {
			show: function (message, duration, position) {
				try{
					$cordovaToast.show(message, duration, position)
						.then(function (success) {
							console.log("The toast was shown");
						}, function (error) {
							console.log("The toast was not shown due to " + error);
						});
				} catch (e) {
					console.error(e);
				}
			},
			getAllNotifications: function(userId, all, cb) {
				var lim = all ? '' : 'limit=20&';
				HttpService.execute('/notifications/?' + lim + 'sort=createdAt DESC&user_id=' + userId, 'GET', null, true)
					.then(function (notificationResponse) {
						cb(null, notificationResponse);
					}, function (notificationError) {
						cb(notificationError);
					});
			},
			getUnreadNotifications: function(cb) {
				HttpService.execute('/notifications/unread?sort=createdAt DESC', 'GET', null, true)
					.then(function (notificationResponse) {
						$rootScope.notificationCount = notificationResponse && notificationResponse.data && notificationResponse.data.length > 0 ? notificationResponse.data.length : '';
						$rootScope.notificationCount = isNaN($rootScope.notificationCount) ? '' : $rootScope.notificationCount;
						cb(null, notificationResponse);
					}, function (notificationError) {
						cb(notificationError);
					});
			},
			markAllRead: function(ids, cb) {
				HttpService.execute('/notifications/markAllRead', 'POST', ids, true)
					.then(function (notificationResponse) {
						$rootScope.notificationCount = $rootScope.notificationCount - ids.length <= 0 ? '' : $rootScope.notificationCount - ids.length;
						$rootScope.notificationCount = isNaN($rootScope.notificationCount) ? '' : $rootScope.notificationCount;
						cb(null, notificationResponse);
					}, function (notificationError) {
						cb(notificationError);
					});
			},
			promptForRating: function() {
                if(typeof AppRate != "undefined") {
                    var customLocale = {};
                    customLocale.title = "Rate hotpsot app";
                    customLocale.message = "If you enjoy using hotpsot would you mind taking a moment to rate it? It won’t take more than a minute. Thanks for your support!";
                    customLocale.cancelButtonLabel = "No, Thanks";
                    customLocale.laterButtonLabel = "Remind Me Later";
                    customLocale.rateButtonLabel = "Rate It Now";

                    AppRate.preferences.openStoreInApp = true;
                    AppRate.preferences.storeAppURL.ios = '1098510970';
                    AppRate.preferences.storeAppURL.android = 'market://details?id=online.hotspot.app';
                    AppRate.preferences.customLocale = customLocale;
                    AppRate.preferences.displayAppName = 'hotpsot';
                    AppRate.preferences.usesUntilPrompt = 3;
                    AppRate.preferences.promptAgainForEachNewVersion = false;
                    AppRate.promptForRating(false); 
                }
			},
			showHelpMessage: function(title, message, cb) {
				var alertPopup = $ionicPopup.alert({
				     title:  title || 'Help Message',
				     template: message || 'No message provided'
				});

			   	alertPopup.then(function(res) {
			   		if(cb) {
			   			cb(res);
			   		}
			   	});
			}
		};

	};

	notification.$inject = ['$http', '$cordovaToast', 'HttpService', '$rootScope', '$ionicPopup'];
	return notification;
});
