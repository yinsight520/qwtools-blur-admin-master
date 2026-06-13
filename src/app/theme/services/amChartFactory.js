/**
 * amCharts shared initialization factory.
 *
 * Centralises the boilerplate that every amCharts controller used to repeat:
 *   - theme / colour / export / pathToImages defaults
 *   - element-id extraction
 *   - lifecycle cleanup (chart.clear() on $destroy)
 *
 * Individual chart controllers only need to supply the config that is truly
 * unique to them (data, graphs, axes, special interactions, etc.).
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .factory('amChartFactory', amChartFactory);

  /** @ngInject */
  function amChartFactory(baConfig, layoutPaths) {
    var layoutColors = baConfig.colors;

    /**
     * Defaults merged into every chart config unless explicitly overridden.
     * Controllers can still set any of these keys to opt-out.
     */
    var baseDefaults = {
      theme: 'blur',
      color: layoutColors.defaultText,
      export: { enabled: true },
      pathToImages: layoutPaths.images.amChart
    };

    return {
      /** Expose colours so controllers that need them don't have to inject baConfig separately. */
      colors: layoutColors,

      /** Expose image paths for the rare case a controller needs the path directly. */
      paths: layoutPaths,

      /**
       * Create and return an AmCharts chart instance.
       *
       * @param {angular.element|string} target  - jqLite element with an id attribute, or a plain DOM id string
       * @param {angular.IScope}         $scope  - used to register the $destroy cleanup listener
       * @param {Object}              chartConfig - chart-specific AmCharts configuration
       * @returns {Object} the created AmCharts chart instance
       */
      createChart: function (target, $scope, chartConfig) {
        var id = typeof target === 'string' ? target : target[0].getAttribute('id');
        var mergedConfig = angular.merge({}, baseDefaults, chartConfig);
        var chart = AmCharts.makeChart(id, mergedConfig);

        if ($scope && $scope.$on) {
          $scope.$on('$destroy', function () {
            if (chart && chart.clear) {
              chart.clear();
            }
          });
        }

        return chart;
      }
    };
  }

})();
