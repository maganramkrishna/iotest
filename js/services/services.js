/*global define */

define(function (require) {

	'use strict';

	var angular = require('angular'),
		config = require('config'),
		services = angular.module('app.services', ['app.config']);

	services.factory('HttpService', require('services/HttpService'));
	services.factory('AuthenticationService', require('services/AuthenticationService'));
	services.factory('NotificationService', require('services/NotificationService'));
	services.factory('UserService', require('services/UserService'));
	services.factory('ImageService', require('services/ImageService'));
	services.factory('ListingService', require('services/ListingService'));
	services.factory('SMSService', require('services/SMSService'));
	services.factory('GeoLocationService', require('services/GeoLocationService'));
	services.factory('CategoryService', require('services/CategoryService'));
	services.factory('FavoritesService', require('services/FavoritesService'));
	services.factory('CommentsService', require('services/CommentsService'));
	services.factory('PaymentService', require('services/PaymentService'));
	services.factory('MessageService', require('services/MessageService'));
	services.factory('OrderService', require('services/OrderService'));
	services.factory('SettingsService', require('services/SettingsService'));
	return services;

});
