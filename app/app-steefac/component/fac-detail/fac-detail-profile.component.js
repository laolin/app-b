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
    controller:['$scope', '$element', 'FacSearch', 'AppbData', ctrl]
  });


  function ctrl($scope, $element, FacSearch, AppbData) {
    $scope.appData = AppbData.getAppData();
    $scope.FacSearch = FacSearch;
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac || {};
      $scope.fee = (function(){
        let fees = Object.values(JSON.parse($scope.fac.fee || '{}'));
        console.log('fees=', fees);
        let totle = 0;
        for(let v of fees) totle += +v;
        return Math.floor(totle / (fees.length || 1));
      })();
    }
  }
})(window, angular);