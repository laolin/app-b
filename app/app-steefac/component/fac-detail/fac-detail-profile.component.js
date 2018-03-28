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
    controller:['$scope', '$element', '$http', 'FacSearch', 'AppbData', 'FacUser', 'SIGN', ctrl]
  });


  function ctrl($scope, $element, $http, FacSearch, AppbData, FacUser, SIGN) {
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
      SIGN.postLaolin('stee_user','get_admin_of_obj',{type: $scope.type, facid: $scope.fac.id}).then(function(json){
        $scope.adminInfo = {
          me: $scope.adminInfo.me,
          admins: json,
          count: json.length
        }
      });
    }
    $http.post("用户/个人信息").then(json => {
      var str = json.datas.me['steeproj_can_admin'] || "";
      $scope.sendFromIds = str ? str.split(',') : [];

      /** 如果用户有[推送项目给产能]权限， 添加最近浏览记录到待推送列表 */
      if(json.datas.rightIcons && json.datas.rightIcons.find(row=>row.name=='推送项目给产能')){
        $http.post("cache/load", { ac: "view-steeproj" }).then(json => {
          var list = json.datas.data;
          if (!angular.isArray(list)) list = [];
          var adminIds = $scope.sendFromIds.length;
          var max = adminIds + list.length;
          for (var i = $scope.sendFromIds.length; i < 10 && i < max; i++) {
            $scope.sendFromIds.push(list.pop());
          }
        });
      }


    })
  }
})(window, angular);