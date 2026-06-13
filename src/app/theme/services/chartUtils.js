/**
 * Shared chart utility functions.
 *
 * Small helpers that are useful across different chart libraries
 * (Chart.js, Chartist, etc.) and would otherwise be copy-pasted
 * into individual controllers.
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .factory('chartUtils', chartUtils);

  function chartUtils() {
    return {
      /**
       * Fisher-Yates in-place shuffle.
       * Mutates and returns the original array.
       */
      shuffle: function (arr) {
        for (var j, x, i = arr.length; i;
             j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
        return arr;
      }
    };
  }

})();
