/*global define, console */

define(['angular'], function(angular) {
    "use strict";

    var filter = function($filter) {

        return function (input, symbol, decimals) {
	      var exp, rounded,
	        suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

	      if(window.isNaN(input)) {
	        return null;
	      }

	      if(input < 1000) {
	        return $filter('currency')(input, symbol, decimals);
	      }

	      exp = Math.floor(Math.log(input) / Math.log(1000));
	      //(input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
	      return (input / Math.pow(1000, exp)) + suffixes[exp - 1];
	    };
    };

    filter.$inject = ['$filter'];
    return filter;
});