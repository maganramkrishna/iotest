/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function (HttpService) {

		return {
			getCategories: function (cb) {
				HttpService.execute('/category?sort=name', 'GET', null, true)
					.then(function (categoryResponse) {
						cb(null, categoryResponse);
					}, function (categoryError) {
						cb(categoryError);
					});
			}
		};

	};

	factory.$inject = ['HttpService'];
	return factory;
});
