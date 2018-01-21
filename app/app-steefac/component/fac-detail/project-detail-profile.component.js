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
    $scope.type = 'steeproj';
    $scope.adminInfo = {
      count: 1,
      me: false
    };
    var ctrl = this;
    this.$onChanges=function(chg){
      $scope.fac = ctrl.fac || {};
      if(!$scope.fac.id)return;
      // 是否管理员
      $scope.isSuperAdmin = FacUser.isSysAdmin();
      $scope.adminInfo.me = FacUser.canAdminObj('steeproj', $scope.fac.id);
      AppbAPI('stee_user','get_admin_of_obj',{type: $scope.type, facid: $scope.fac.id}).then(function(json){
        $scope.adminInfo = {
          me: $scope.adminInfo.me,
          admins: json,
          count: json.length
        }
      });
    }
  }
})(window, angular);