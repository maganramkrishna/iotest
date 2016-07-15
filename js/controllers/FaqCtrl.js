define(function () {
	'use strict';


	function faqCtrl($scope, $state, $filter, SettingsService) {
		SettingsService.getSettings(function(err, settings) {
			$scope.faq = $filter('filter')(settings.data, {key: 'faq'})[0].value;
		});
	}

	faqCtrl.$inject = ['$scope', '$state', '$filter', 'SettingsService'];
	return faqCtrl;

});
