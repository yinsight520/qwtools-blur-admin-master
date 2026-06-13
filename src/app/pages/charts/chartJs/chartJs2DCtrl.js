/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.charts.chartJs')
    .controller('chartJs2DCtrl', chartJs2DCtrl);

  /** @ngInject */
  function chartJs2DCtrl($scope, chartUtils) {
    $scope.labels =["May", "Jun", "Jul", "Aug", "Sep"];
    $scope.data = [
      [65, 59, 90, 81, 56],
      [28, 48, 40, 19, 88]
    ];
    $scope.series = ['Product A', 'Product B'];

    $scope.changeData = function () {
      $scope.data[0] = chartUtils.shuffle($scope.data[0]);
      $scope.data[1] = chartUtils.shuffle($scope.data[1]);
    };
  }

})();
