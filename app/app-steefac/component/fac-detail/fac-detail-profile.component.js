/**
 * 公司详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('facDetailProfile',{
    templateUrl: 'app-steefac/component/fac-detail/fac-detail-profile.template.html',
    bindings: {
      fac: '<'
    },
    controller:['$scope', '$element', 'FacSearch', ctrl]
  });


  function ctrl($scope, $element, FacSearch) {
    $scope.FacSearch = FacSearch;
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac;
    }
  }
})(window, angular);