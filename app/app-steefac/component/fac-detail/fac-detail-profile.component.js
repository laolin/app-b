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
    $scope.type = 'steefac';
    $scope.adminInfo = {
      count: 1,
      me: false
    };
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac || {};
      if(!$scope.fac.id)return;
      $scope.sendtoIds = [$scope.fac.id];
      // 是否管理员
      $scope.isSuperAdmin = !!FacUser.isSysAdmin();
      $scope.adminInfo.me = FacUser.canAdminObj('steefac', $scope.fac.id);
      $scope.adminInfo.count = 0;

      $scope.fee = (function(){
        var fees = JSON.parse($scope.fac.fee || '{}');
        var totle = 0;
        var nFee = 0;
        for(var i in fees) {
          if(+fees[i]<=0) continue;
          totle += +fees[i];
          nFee ++;
        }
        return Math.floor(totle / (nFee || 1));
      })();
      AppbAPI('stee_user','get_admin_of_obj',{type: $scope.type, facid: $scope.fac.id}).then(function(json){
        $scope.adminInfo = {
          me: $scope.adminInfo.me,
          admins: json,
          count: json.length
        }
      });
    }
    FacUser.getMyData().then((myData)=>{
      $scope.myData = myData;
    })
  }
})(window, angular);