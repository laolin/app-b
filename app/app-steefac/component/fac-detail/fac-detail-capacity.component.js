/**
 * 公司详情-有效产能组件
 * ver: 0.0.1
 * build: 2018-01-02
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('facDetailCapacity',{
    templateUrl: 'app-steefac/component/fac-detail/fac-detail-capacity.template.html',
    bindings: {
      fac: '<'
    },
    controller:['$scope', '$element', 'FacSearch', 'AppbData', 'FacDefine', ctrl]
  });


  function ctrl($scope, $element, FacSearch, AppbData, FacDefine) {
    $scope.appData = AppbData.getAppData();
    $scope.FacSearch = FacSearch;
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac;
      $scope.goodat = FacDefine.goodatOptions; // ((ctrl.fac||{}).goodat||'').split(',');
      $scope.fee = JSON.parse((ctrl.fac||{}).fee||'{}');
    }
  }
})(window, angular);