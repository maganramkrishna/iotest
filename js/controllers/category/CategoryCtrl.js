define(function () {
	'use strict';

	function ctrl($scope, $state, $timeout, $filter, CategoryService) {
		$scope.categories = [];
		CategoryService.getCategories(function (err, categoryResponse) {
			var cats = categoryResponse.data ? categoryResponse.data : $scope.categories;
			$scope.categories = $filter('filter')(cats, {isFeatured: true});
		});
	}

	ctrl.$inject = ['$scope', '$state', '$timeout', '$filter', 'CategoryService'];
	return ctrl;

});
