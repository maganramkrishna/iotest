/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function (HttpService) {
		
		return {
			getSettings: function(cb){
				HttpService.execute('/settings', 'GET', null, true)
					.then(function (response) {
						cb(null, response);
					}, function (err) {
						cb(err);
					});
			}
		};
	};

	factory.$inject = ['HttpService'];
	return factory;
});
