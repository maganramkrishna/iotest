define(function () {
	'use strict';


	function eulaCtrl($scope, $state, $filter, SettingsService) {
		SettingsService.getSettings(function(err, settings) {
			$scope.eula = $filter('filter')(settings.data, {key: 'eula'})[0].value;
		});
	}

	eulaCtrl.$inject = ['$scope', '$state', '$filter', 'SettingsService'];
	return eulaCtrl;

});
