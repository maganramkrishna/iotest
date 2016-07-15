/*global define, console */

define(['angular'], function (angular) {
	"use strict";

	var factory = function (HttpService) {
		return {
			sendVerificationMessage: function(to, code, cb) {
				var smsVerificationRequest = {
					to: to,
					code: code
				};

				HttpService.execute('/sms/verification', 'POST', smsVerificationRequest, true)
					.then(function (smsResponse) {
						cb(null, smsResponse);
					}, function (smsError) {
						cb(smsError);
					});
			}
		};
	};

	factory.$inject = ['HttpService'];
	return factory;
});
