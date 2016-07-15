/*global define*/

define(['angular'], function (angular) {
	"use strict";

	var directive = function ($ionicPopover) {
		return {
			restrict: 'E',
			templateUrl: 'templates/partials/footerMenu.html',
			link: function (scope, elm, attrs) {
				// .fromTemplate() method
				var template = '<ion-popover-view><ion-header-bar> <h4 class="title">Filter</h4> </ion-header-bar>' +
				'<ion-content>' +
						'<ion-checkbox>Auction Items</ion-checkbox>' +
						'<ion-checkbox>Buy Now Items</ion-checkbox>' +
				'</ion-content>' +
				'</ion-popover-view>';

				scope.popover = $ionicPopover.fromTemplate(template, {
				    scope: scope
				});

				scope.openPopover = function($event) {
					scope.popover.show($event);
				};

				//Cleanup the popover when we're done with it!
				scope.$on('$destroy', function() {
				   scope.popover.remove();
				});
			}
		};
	};

	directive.$inject = ['$ionicPopover'];
	return directive;
});
