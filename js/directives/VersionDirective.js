/*global define*/

define(['angular'], function (angular) {
	"use strict";

	var directive = function (CONFIG) {
		return {
			restrict: 'E',
			template: '<b></b>',
			link: function (scope, elm, attrs) {
				elm.text(CONFIG.VERSION);
			}
		};
	};

	directive.$inject = ['CONFIG'];
	return directive;
});
