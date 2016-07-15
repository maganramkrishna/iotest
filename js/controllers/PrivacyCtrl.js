define(function () {
	'use strict';


	function privacyCtrl($scope, $state, $filter, SettingsService) {
		SettingsService.getSettings(function(err, settings) {
			$scope.privacy = $filter('filter')(settings.data, {key: 'privacy'})[0].value;
		});
	}

	privacyCtrl.$inject = ['$scope', '$state', '$filter', 'SettingsService'];
	return privacyCtrl;

});
