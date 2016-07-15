/*global define*/

define(['angular'], function (angular) {
	"use strict";

	var directive = function (CONFIG, FavoritesService, $state, $ionicPopup) {
		return {
			restrict: 'E',
			scope: {
				type: '=',
				favid: '@',
				listid: '@'
			},
			transclude: true,
			template: '<i ng-class="favid > 0 ? ion-android-favorite: ion-android-favorite-outline" class="favorite-icon ion ion-android-favorite-outline"></i>',
			link: function (scope, elm, attrs) {
				var currentUser = window.localStorage.getItem('userId');
				var icon = elm.find('i');
				function Init() {
					if(scope.favid > 0) {
						icon.removeClass('ion-android-favorite-outline')
							.addClass('ion-android-favorite');
					}
				}

				scope.$watch('favid', function(newValue){
					if(newValue > 0) {
						icon.removeClass('ion-android-favorite-outline')
							.addClass('ion-android-favorite');
					} else {
						icon.removeClass('ion-android-favorite')
							.addClass('ion-android-favorite-outline');
					}
				});

				function actionHandler () {

					if (currentUser) {
						var isFav = icon.hasClass('ion-android-favorite');
						if (isFav) {
							FavoritesService.unFavoriteListing(scope.favid, function (err, result) {
								console.log(err, result);
								if (!err) {
									icon.removeClass('ion-android-favorite')
										.addClass('ion-android-favorite-outline');
								}
							});
						}
						else {
							FavoritesService.addFavoriteListing(currentUser, scope.listid, function (err, result) {
								console.log(err, result);
								if (!err) {
									icon.removeClass('ion-android-favorite-outline')
										.addClass('ion-android-favorite');
								}
							});
						}
					}
					else {
						var alertPopup = $ionicPopup.alert({
							title: 'Log In',
							template: 'You must login to make this action'
						});
						alertPopup.then(function (res) {
							$state.go('app.login');
						});
					}
					console.log("Favoriting ", scope.type, scope.listid);
				}

				elm.bind('click', actionHandler);
				Init();
			}
		};
	};

	directive.$inject = ['CONFIG', 'FavoritesService', '$state', '$ionicPopup'];
	return directive;
});
