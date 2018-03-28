/**
 * 公司详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('facMiniCell', function(){
    return {
      restrict: 'AE',
      templateUrl: 'app-steefac/component/fac-detail/fac-mini-cell.template.html',
      scope: {
        cell: "="
      },
      controller: ['$scope', '$element', '$location', 'FacUser', ctrl]
    }
  });

  function ctrl($scope, $element, $location, FacUser) {
    $element.click( () => {
      var fac = $scope.cell.fac;
      var type = $scope.cell.type;
      FacUser.clickFac(fac, type);
    });
  }

})(window, angular);