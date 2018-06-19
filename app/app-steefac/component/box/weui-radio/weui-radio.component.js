/**
 * weui风格选框组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('weuiRadio', function(){
    return {
      restrict: 'E',
      templateUrl: 'app-steefac/component/box/weui-radio/weui-radio.template.html',
      scope: {
        ngModel: '=',
        text: '@',
        valueObject: '=?value'
      },
      controller:['$scope', '$element', ctrl]
    };
  });

  function ctrl($scope, $element) {
    $scope.checked = false;
    function init(){
      $scope.value = $scope.valueObject || 1;
      $scope.checked = $scope.value == $scope.ngModel;
    }
    $scope.$watch("ngModel", init);
    $scope.$watch("value", init);
    $scope.click = () => {
      $scope.checked = !$scope.checked;
      $scope.ngModel = $scope.checked && $scope.value || '';
    }
  }
})(window, angular);