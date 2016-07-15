/*global define */

define(function (require) {

	'use strict';

	var angular = require('angular'),
		config = require('config'),
		filters = angular.module('app.filters', ['app.config']);

	filters.filter('priceFormat', require('filters/PriceFormat'));
	
	return filters;

});
