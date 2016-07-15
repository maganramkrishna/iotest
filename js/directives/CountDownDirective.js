/*global define*/

define(['angular'], function (angular) {
	"use strict";
	function dhms(t, msg) {
		var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days |0 * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours | 0 * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes | 0 * 60;
            seconds = t % 60;

            if(days <= 0 && hours <=0 && minutes <=0 && seconds <= 0) {
                return msg || '0d 0h 0m 0s';
            }
            return [
                days + 'd',
                hours + 'h',
                minutes + 'm',
                seconds + 's'
            ].join(' ');
	}
	var directive = function ($interval) {
		return {
			restrict: 'A',
			scope: {
				date: '@',
                message: '@'
			},
			link: function (scope, elm, attrs) {
				var future = new Date(scope.date);
                $interval(function () {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return elm.text(dhms(diff, scope.message));
                }, 1000);
			}
		};
	};

	directive.$inject = ['$interval'];
	return directive;
});
