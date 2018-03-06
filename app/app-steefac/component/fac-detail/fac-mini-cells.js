/**
 * 公司详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('facMiniCells', function(){
    return {
      restrict: 'AE',
      templateUrl: 'app-steefac/component/fac-detail/fac-mini-cells.template.html',
      scope: {
        title: "@",
        cells: "="
      },
      controller: ['$scope', '$element', '$location', 'FacUser', ctrl]
    }
  });

  function ctrl($scope, $element, $location, FacUser) {
  }

})(window, angular);