/**
 * @author a.demeshko
 * created on 12/21/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .service('stopableInterval', stopableInterval);

  /** @ngInject */
  function stopableInterval($window) {
    return {
      start: function (interval, calback, time) {
        function startInterval() {
          return interval(calback, time);
        }

        var i = startInterval();
        var $win = angular.element($window);

        function onFocus() {
          if (i) interval.cancel(i);
          i = startInterval();
        }

        function onBlur() {
          if (i) interval.cancel(i);
        }

        $win.bind('focus', onFocus);
        $win.bind('blur', onBlur);

        return function stop() {
          if (i) interval.cancel(i);
          i = null;
          $win.unbind('focus', onFocus);
          $win.unbind('blur', onBlur);
        };
      }
    }
  }

})();