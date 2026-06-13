/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.charts.chartist')
    .controller('chartistCtrl', chartistCtrl);

  /** @ngInject */
  function chartistCtrl($scope, $timeout, baConfig) {

    var layoutColors = baConfig.colors;

    // ── Shared base options ────────────────────────────────────────────
    // Most Chartist charts use the same height / fullWidth / colour.
    // Individual charts override whatever they need.
    var baseOptions = {
      color: layoutColors.defaultText,
      fullWidth: true,
      height: '300px'
    };

    function mergeOptions(overrides) {
      return angular.extend({}, baseOptions, overrides);
    }

    // ── Chart instances ───────────────────────────────────────────────
    // Collected here so they can all be detached when the scope is destroyed.
    var chartInstances = [];

    function createChart(ChartType, selector, data, options, responsive) {
      var instance = new Chartist[ChartType](selector, data, options, responsive);
      chartInstances.push(instance);
      return instance;
    }

    // ── Line charts ───────────────────────────────────────────────────

    $scope.simpleLineData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [
        [20, 20, 12, 45, 50],
        [10, 45, 30, 14, 12],
        [34, 12, 12, 40, 50],
        [10, 43, 25, 22, 16],
        [3, 6, 30, 33, 43]
      ]
    };
    $scope.simpleLineOptions = mergeOptions({
      chartPadding: { right: 40 }
    });

    $scope.areaLineData = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      series: [[5, 9, 7, 8, 5, 3, 5, 4]]
    };
    $scope.areaLineOptions = mergeOptions({
      low: 0,
      showArea: true
    });

    $scope.biLineData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        [1, 2, 3, 1, -2, 0, 1],
        [-2, -1, -2, -1, -2.5, -1, -2],
        [0, 0, 0, 1, 2, 2.5, 2],
        [2.5, 2, 1, 0.5, 1, 0.5, -1]
      ]
    };
    $scope.biLineOptions = mergeOptions({
      high: 3,
      low: -3,
      showArea: true,
      showLine: false,
      showPoint: false,
      axisX: { showGrid: false }
    });

    // ── Bar charts ────────────────────────────────────────────────────

    $scope.simpleBarData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        [15, 24, 43, 27, 5, 10, 23, 44, 68, 50, 26, 8],
        [13, 22, 49, 22, 4, 6, 24, 46, 57, 48, 22, 4]
      ]
    };
    $scope.simpleBarOptions = mergeOptions({});

    $scope.multiBarData = {
      labels: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
      series: [
        [5, 4, 3, 7],
        [3, 2, 9, 5],
        [1, 5, 8, 4],
        [2, 3, 4, 6],
        [4, 1, 2, 1]
      ]
    };
    $scope.multiBarOptions = mergeOptions({
      stackBars: true,
      axisX: {
        labelInterpolationFnc: function (value) {
          return value.split(/\s+/).map(function (word) { return word[0]; }).join('');
        }
      },
      axisY: { offset: 20 }
    });
    $scope.multiBarResponsive = [
      ['screen and (min-width: 400px)', {
        reverseData: true,
        horizontalBars: true,
        axisX: { labelInterpolationFnc: Chartist.noop },
        axisY: { offset: 60 }
      }],
      ['screen and (min-width: 700px)', {
        stackBars: false,
        reverseData: false,
        horizontalBars: false,
        seriesBarDistance: 15
      }]
    ];

    $scope.stackedBarData = {
      labels: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
      series: [
        [800000, 1200000, 1400000, 1300000],
        [200000, 400000, 500000, 300000],
        [100000, 200000, 400000, 600000]
      ]
    };
    $scope.stackedBarOptions = mergeOptions({
      stackBars: true,
      axisY: {
        labelInterpolationFnc: function (value) {
          return (value / 1000) + 'k';
        }
      }
    });

    // ── Pie & Donut charts ────────────────────────────────────────────

    $scope.simplePieData = { series: [5, 3, 4] };
    $scope.simplePieOptions = mergeOptions({
      weight: '300px',
      labelInterpolationFnc: function (value) {
        return Math.round(value / 12 * 100) + '%';
      }
    });

    $scope.labelsPieData = {
      labels: ['Bananas', 'Apples', 'Grapes'],
      series: [20, 15, 40]
    };
    $scope.labelsPieOptions = mergeOptions({
      weight: '300px',
      labelDirection: 'explode',
      labelInterpolationFnc: function (value) { return value[0]; }
    });

    $scope.simpleDonutData = {
      labels: ['Bananas', 'Apples', 'Grapes'],
      series: [20, 15, 40]
    };
    $scope.simpleDonutOptions = mergeOptions({
      donut: true,
      weight: '300px',
      labelDirection: 'explode',
      labelInterpolationFnc: function (value) { return value[0]; }
    });

    // ── Responsive helpers ────────────────────────────────────────────

    $scope.donutResponsive = getResponsive(5, 40);
    $scope.pieResponsive = getResponsive(20, 80);

    function getResponsive(padding, offset) {
      return [
        ['screen and (min-width: 1550px)', {
          chartPadding: padding, labelOffset: offset,
          labelDirection: 'explode',
          labelInterpolationFnc: function (value) { return value; }
        }],
        ['screen and (max-width: 1200px)', {
          chartPadding: padding, labelOffset: offset,
          labelDirection: 'explode',
          labelInterpolationFnc: function (value) { return value; }
        }],
        ['screen and (max-width: 600px)', {
          chartPadding: 0, labelOffset: 0,
          labelInterpolationFnc: function (value) { return value[0]; }
        }]
      ];
    }

    // ── Instantiate all charts after the DOM is ready ─────────────────

    $timeout(function () {
      createChart('Line', '#line-chart',  $scope.simpleLineData, $scope.simpleLineOptions);
      createChart('Line', '#area-chart',  $scope.areaLineData,   $scope.areaLineOptions);
      createChart('Line', '#bi-chart',    $scope.biLineData,     $scope.biLineOptions);

      createChart('Bar', '#simple-bar',   $scope.simpleBarData,  $scope.simpleBarOptions);
      createChart('Bar', '#multi-bar',    $scope.multiBarData,   $scope.multiBarOptions,   $scope.multiBarResponsive);
      createChart('Bar', '#stacked-bar',  $scope.stackedBarData, $scope.stackedBarOptions);

      createChart('Pie', '#simple-pie',   $scope.simplePieData,  $scope.simplePieOptions,  $scope.pieResponsive);
      createChart('Pie', '#label-pie',    $scope.labelsPieData,  $scope.labelsPieOptions);
      createChart('Pie', '#donut',        $scope.simpleDonutData,$scope.simpleDonutOptions,$scope.donutResponsive);
    });

    // ── Lifecycle cleanup ─────────────────────────────────────────────

    $scope.$on('$destroy', function () {
      chartInstances.forEach(function (chart) {
        if (chart && chart.detach) {
          chart.detach();
        }
      });
      chartInstances.length = 0;
    });
  }
})();
