/**
 * Common factory for creating amCharts instances with shared defaults
 * and automatic lifecycle cleanup.
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.charts.amCharts')
    .factory('amChartHelper', amChartHelper);

  /** @ngInject */
  function amChartHelper(baConfig, layoutPaths) {
    var colors = baConfig.colors;

    var DEFAULTS = {
      theme: 'blur',
      color: colors.defaultText,
      pathToImages: layoutPaths.images.amChart,
      export: {
        enabled: true
      }
    };

    return {
      colors: colors,
      create: create
    };

    function create($scope, $element, chartConfig) {
      var id = $element[0].getAttribute('id');
      var merged = angular.merge({}, DEFAULTS, chartConfig);
      var chart = AmCharts.makeChart(id, merged);

      $scope.$on('$destroy', function () {
        chart.clear();
      });

      return chart;
    }
  }
})();
