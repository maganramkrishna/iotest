/*global define, require */

define(['app'], function (app) {
	'use strict';

	app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$stateProvider.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl'
		}).state('app.landing', {
			url: '/home',
			views: {
				'menuContent': {
					templateUrl: 'templates/landing.html',
					controller: 'LoginCtrl'
				}
			}
		}).state('app.login', {
			url: '/login',
			views: {
				'menuContent': {
					templateUrl: 'templates/login.html',
					controller: 'LoginCtrl'
				}
			}
		}).state('app.register', {
			url: '/register',
			views: {
				'menuContent': {
					templateUrl: 'templates/register.html',
					controller: 'RegisterCtrl'
				}
			}
		}).state('app.search', {
			url: '/search',
			views: {
				'menuContent': {
					templateUrl: 'templates/search.html'
				}
			}
		}).state('app.messages', {
			url: '/messages?state',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/messages/messagelist.html',
					controller: 'MessageCtrl'
				}
			}
		}).state('app.messageThread', {
			url: '/messageThread/:threadParentId',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/messages/messageThread.html',
					controller: 'MessageThreadCtrl'
				}
			}
		}).state('app.orders', {
			url: '/orders',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/orders/orderslist.html',
					controller: 'OrderCtrl'
				}
			}
		}).state('app.orderDetails', {
			url: '/orderDetails/:orderId',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/orders/orderDetails.html',
					controller: 'OrderDetailsCtrl'
				}
			}
		}).state('app.categories', {
			url: '/categories',
			views: {
				'menuContent': {
					templateUrl: 'templates/category/categories.html',
					controller: 'CategoryCtrl'
				}
			}
		}).state('app.listings', {
			url: '/listings',
			cache: true,
			views: {
				'menuContent': {
					templateUrl: 'templates/listing/listings.html',
					controller: 'ListingsCtrl'
				}
			}
		}).state('app.mylistings', {
			url: '/mylistings',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/listing/mylistings.html',
					controller: 'MyListingsCtrl'
				}
			}
		}).state('app.favoritelistings', {
			url: '/favoritelistings',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/listing/listings.html',
					controller: 'FavoritesListingCtrl'
				}
			}
		}).state('app.listing', {
			url: '/listing/:listingId',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/listing/listing.html',
					controller: 'ListingCtrl'
				}
			}
		}).state('app.categorylistings', {
			url: '/listing/category/:categoryId',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/listing/category.html',
					controller: 'CategoryListingCtrl'
				}
			}
		}).state('app.createListing', {
			url: '/listings/create?listingId&repost',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/listing/createListing1.html',
					controller: 'CreateListingCtrl'
				}
			}
		}).state('app.myprofile', {
			url: '/myprofile/',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/user/myprofile.html',
					controller: 'UserCtrl'
				}
			}
		}).state('app.profile', {
			url: '/profile/:userId',
			views: {
				'menuContent': {
					templateUrl: 'templates/user/profile.html',
					controller: 'ProfileCtrl'
				}
			}
		}).state('app.share', {
			url: '/share',
			views: {
				'menuContent': {
					templateUrl: 'templates/social/share.html',
					controller: 'ShareCtrl'
				}
			}
		}).state('app.payments', {
			url: '/payments?state',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/payments/index.html',
					controller: 'PaymentsCtrl'
				}
			}
		}).state('app.payments.creditcard', {
			url: '/payments/creditcard',
			views: {
				'payments-creditcard': {
					templateUrl: 'templates/payments/creditcard.html',
					controller: 'PaymentsCtrl'
				}
			}
		}).state('app.payments.bank', {
			url: '/payments/bank',
			views: {
				'payments-bank': {
					templateUrl: 'templates/payments/bank.html',
					controller: 'PaymentsCtrl'
				}
			}
		}).state('app.privacy', {
			url: '/privacy',
			views: {
				'menuContent': {
					templateUrl: 'templates/privacy.html',
					controller: 'PrivacyCtrl'
				}
			}
		}).state('app.faq', {
			url: '/faq',
			views: {
				'menuContent': {
					templateUrl: 'templates/faq.html',
					controller: 'FaqCtrl'
				}
			}
		}).state('app.eula', {
			url: '/eula',
			views: {
				'menuContent': {
					templateUrl: 'templates/eula.html',
					controller: 'EulaCtrl'
				}
			}
		}).state('app.aboutus', {
			url: '/aboutus',
			views: {
				'menuContent': {
					templateUrl: 'templates/about.html',
					controller: 'AboutCtrl'
				}
			}
		}).state('app.notifications', {
			url: '/notifications',
			views: {
				'menuContent': {
					templateUrl: 'templates/notification/notification.html',
					controller: 'NotificationCtrl'
				}
			}
		});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/listings');
	}]);
});