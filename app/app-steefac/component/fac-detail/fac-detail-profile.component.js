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
    controller:['$scope', '$element', 'FacSearch', 'AppbData', 'FacUser', 'AppbAPI', ctrl]
  });


  function ctrl($scope, $element, FacSearch, AppbData, FacUser, AppbAPI) {
    $scope.appData = AppbData.getAppData();
    $scope.FacSearch = FacSearch;
    $scope.canAddAdmin =  false;
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac || {};
      if(!$scope.fac.id)return;
      // 是否管理员
      $scope.isSuperAdmin = !!FacUser.isAdmin();
      $scope.isThisAdmin = FacUser.canAdminObj('steefac', $scope.fac.id);

      $scope.fee = (function(){
        let fees = Object.values(JSON.parse($scope.fac.fee || '{}'));
        let totle = 0;
        for(let v of fees) totle += +v;
        return Math.floor(totle / (fees.length || 1));
      })();
      AppbAPI('stee_user','get_admin_of_obj',{type:'steefac', facid: $scope.fac.id}).then(function(json){
        console.log('有管理员？', json);
        $scope.canAddAdmin = json.length == 0; // 为了一开始不显示数据？！
      });
    }
  }
})(window, angular);