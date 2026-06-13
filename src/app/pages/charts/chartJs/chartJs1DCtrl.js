/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.charts.chartJs')
    .controller('chartJs1DCtrl', chartJs1DCtrl);

  /** @ngInject */
  function chartJs1DCtrl($scope, baConfig, chartUtils) {
    var layoutColors = baConfig.colors;

    $scope.labels =["Sleeping", "Designing", "Coding", "Cycling"];
    $scope.data = [20, 40, 5, 35];
    $scope.options = {
      elements: {
        arc: {
          borderWidth: 0
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: layoutColors.defaultText
        }
      }
    };

    $scope.changeData = function () {
      $scope.data = chartUtils.shuffle($scope.data);
    };
  }

})();
