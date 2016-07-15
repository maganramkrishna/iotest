/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function ($http) {

		var baseUrl = 'https://hotspot-server.herokuapp.com';

		return {
			getAddress: function (lattitude, longitude, cb) {
				var request = {
					method: 'GET',
					url: 'https://pickpoint.io/api/v1/reverse?key=GxXwfQDjmdWFYfvsoCbt&lat='+lattitude+'&lon='+longitude+'&zoom=18'
				};
				$http(request).then(function(addressResponse){
					cb(null, addressResponse);
				}, function(addressError){
					cb(addressError);
				});
			}
		};
	};

	factory.$inject = ['$http'];
	return factory;
});
