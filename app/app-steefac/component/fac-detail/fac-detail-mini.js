/**
 * 公司详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('facDetailMini', function(){
    return {
      restrict: 'AE',
      templateUrl: 'app-steefac/component/fac-detail/fac-detail-mini.template.html',
      scope: {
        fac: "="
      },
      controller: ['$scope', ctrl]
    }
  });

  function ctrl($scope) {
  }

})(window, angular);