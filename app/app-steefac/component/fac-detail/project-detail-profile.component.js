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
    controller:['$scope', '$element', 'FacSearch', 'AppbData', 'ProjDefine', 'FacUser', 'AppbAPI', ctrl]
  });


  function ctrl($scope, $element, FacSearch, AppbData, ProjDefine, FacUser, AppbAPI) {
    $scope.appData = AppbData.getAppData();
    $scope.FacSearch = FacSearch;
    $scope.ProjDefine = ProjDefine;
    $scope.canAddAdmin =  false;
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac || {};
      if(!$scope.fac.id)return;
      // 是否管理员
      $scope.isSuperAdmin = FacUser.isSysAdmin();
      $scope.isThisAdmin = FacUser.canAdminObj('steeproj', $scope.fac.id);
      AppbAPI('stee_user','get_admin_of_obj',{type:'steeproj', facid: $scope.fac.id}).then(function(json){
        console.log('有管理员？', json);
        console.log('isSuperAdmin', $scope.isSuperAdmin);
        $scope.canAddAdmin = json.length == 0; // 为了一开始不显示数据？！
      });
    }
  }
})(window, angular);