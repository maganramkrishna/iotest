define(function () {
	'use strict';


	function aboutCtrl($scope, $state, $filter, SettingsService) {
		SettingsService.getSettings(function(err, settings) {
			$scope.faq = $filter('filter')(settings.data, {key: 'about'})[0].value;
		});
	}

	aboutCtrl.$inject = ['$scope', '$state', '$filter', 'SettingsService'];
	return aboutCtrl;

});
