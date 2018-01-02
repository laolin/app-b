/**
 * 项目详情-项目产能组件
 * ver: 0.0.1
 * build: 2018-01-02
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('projectDetailCapacity',{
    templateUrl: 'app-steefac/component/fac-detail/project-detail-capacity.template.html',
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
      $scope.goodat = ((ctrl.fac||{}).goodat||'').split(',');
      $scope.fee = JSON.parse((ctrl.fac||{}).fee||'{}');
    }
  }
})(window, angular);