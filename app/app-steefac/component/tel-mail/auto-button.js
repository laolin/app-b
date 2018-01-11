/**
 * 成为管理员
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('tobeAdmin', function() {
    return {
      restrict: 'A',
      scope: {
        tobeAdmin: '@',
        type: '@',
        fac: '=?',
      },
      controller:['$scope', '$element', 'FacUser', tobeAdmin]
    };
  })


  function tobeAdmin($scope, $element, FacUser) {
    $element[0].addEventListener('click', () => {
      var type = $scope.tobeAdmin || $scope.type || 'steefac';
      var fac = $scope.fac;
      $scope.$apply(()=>{
        FacUser.applyAdmin(type, fac);
      });
    }, true);
  }
})(window, angular);