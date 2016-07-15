/*global define */

define(function (require) {

	'use strict';

	var angular = require('angular'),
		services = require('services/services'),
		directives = angular.module('app.directives', ['app.services']);

	directives.directive('appVersion', require('directives/VersionDirective'));
	directives.directive('imageSlider', require('directives/ImageSliderDirective'));
	directives.directive('footerMenu', require('directives/FooterMenuDirective'));
	directives.directive('favorites', require('directives/FavoritesDirective'));
	directives.directive('countdown', require('directives/CountDownDirective'));
	return directives;
});
