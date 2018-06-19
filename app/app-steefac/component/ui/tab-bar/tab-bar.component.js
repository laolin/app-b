/**
 * tab条组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {
  'use strict';

  angular.module('steefac').directive('tabBar', function () {
    return {
      restrict: 'AE',
      templateUrl: 'app-steefac/component/ui/tab-bar/tab-bar.template.html',
      scope: {
        list: '=',
        active: '@',
        itemCss: '@',
        activeCss: '@',
        tabClick: '&',
      },
      controller: ['$scope', '$element', ctrl]
    };
  });


  function ctrl($scope, $element) {
    $scope.$watch("active", function (vNew) {
      $scope.active = vNew || 0;
    });
    $scope.clickTab = function (index, item) {
      $scope.active = index;
      $scope.tabClick && $scope.tabClick({ $n: index, item: item });
    };
  }
})(window, angular);