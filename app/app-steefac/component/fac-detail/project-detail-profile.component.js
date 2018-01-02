/**
 * 项目详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('projectDetailProfile',{
    templateUrl: 'app-steefac/component/fac-detail/project-detail-profile.template.html',
    bindings: {
      fac: '<'
    },
    controller:['$scope', '$element', 'FacSearch', 'AppbData', 'ProjDefine', ctrl]
  });


  function ctrl($scope, $element, FacSearch, AppbData, ProjDefine) {
    $scope.appData = AppbData.getAppData();
    $scope.FacSearch = FacSearch;
    $scope.ProjDefine = ProjDefine;
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac;
    }
  }
})(window, angular);