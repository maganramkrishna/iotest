/*global define, require */

define(function (require) {

	'use strict';

	var angular = require('angular'),
		services = require('services/services'),
		config = require('config'),
		controllers = angular.module('app.controllers', ['app.services', 'app.config']);

	controllers.controller('AppCtrl', require('controllers/AppCtrl'));
	controllers.controller('LoginCtrl', require('controllers/LoginCtrl'));
	//Listing
	controllers.controller('ListingsCtrl', require('controllers/listing/ListingsCtrl'));
	controllers.controller('MyListingsCtrl', require('controllers/listing/MyListingsCtrl'));
	controllers.controller('ListingCtrl', require('controllers/listing/ListingCtrl'));
	controllers.controller('CreateListingCtrl', require('controllers/listing/CreateListingCtrl'));
	controllers.controller('FavoritesListingCtrl', require('controllers/listing/FavoritesListingCtrl'));
	controllers.controller('CategoryListingCtrl', require('controllers/listing/CategoryListingCtrl'));

	//Messages
	controllers.controller('MessageCtrl', require('controllers/messages/MessageCtrl'));
	controllers.controller('MessageThreadCtrl', require('controllers/messages/MessageThreadCtrl'));

	controllers.controller('RegisterCtrl', require('controllers/RegisterCtrl'));
	controllers.controller('UserCtrl', require('controllers/user/UserCtrl'));
	controllers.controller('ProfileCtrl', require('controllers/user/ProfileCtrl'));
	controllers.controller('CategoryCtrl', require('controllers/category/CategoryCtrl'));
	controllers.controller('ShareCtrl', require('controllers/social/ShareCtrl'));

	//Payments 
	controllers.controller('PaymentsCtrl', require('controllers/payments/PaymentsCtrl'));
	controllers.controller('OrderCtrl', require('controllers/orders/OrderCtrl'));	
	controllers.controller('OrderDetailsCtrl', require('controllers/orders/OrderDetailsCtrl'));	

	//Privacy
	controllers.controller('PrivacyCtrl', require('controllers/PrivacyCtrl'));	
	controllers.controller('FaqCtrl', require('controllers/FaqCtrl'));	
	controllers.controller('EulaCtrl', require('controllers/EulaCtrl'));	
	controllers.controller('AboutCtrl', require('controllers/AboutCtrl'));	

	//Notification
	controllers.controller('NotificationCtrl', require('controllers/notification/NotificationCtrl'));		

	controllers.run(['$rootScope', function ($rootScope) {
		$rootScope.sampleParam = "value";
    }]);

	return controllers;

});
