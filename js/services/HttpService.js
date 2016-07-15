/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function ($http, CONFIG) {

		var baseUrl = CONFIG.baseUrl;

		return {
			execute: function (relativePath, method, objectToSend, isAuth) {
				var requestUrl = baseUrl + relativePath;
				var token = window.localStorage.getItem('token');
				var request = {
					method: method,
					url: requestUrl,
					data: objectToSend
				};
				if (isAuth) {
					request.headers = {
						'Authorization': 'Bearer ' + token
					};
				}
				return $http(request);
			}
		};

	};

	factory.$inject = ['$http', 'CONFIG'];
	return factory;
});
