/**
 * 项目详情页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/project-detail/:id', {
      pageTitle: "项目详情",
      templateUrl: 'app-steefac/view/project-detail/project-detail.template.html',
      controller: ['$scope', '$routeParams', '$location', 'AppbData','$q','FacSearch','FacUser', ctrl]
    });
  }]);

  function ctrl($scope, $routeParams, $location, AppbData,$q,FacSearch,FacUser) {
    var appData=AppbData.getAppData();
    var userData=AppbData.getUserData();
    var facId = $routeParams.id;
    /**
     * 初始化
     */
    $q.all([
      FacUser.readObjDetail("steeproj", facId),
      FacUser.getMyData()
    ]).then(
      function(results){
        // 是否管理员
        if(FacUser.isSysAdmin())$scope.canEdit=true;
        // 处理公司数据
        return FacUser.preReadDetail('steeproj', facId, results[0].data).then(fac => {
          resolveFac(fac);
        })
      },
      function(json){
        console.log('读取详情错误', json);
        return $location.path( "/search" ).search({}).replace();
      }
    );
    // 处理公司数据
    function resolveFac(fac){
      appData.setPageTitleAndWxShareTitle(fac.name+'-详情');
      $scope.fac = fac;
      FacSearch.markObj(fac, 'steeproj');
    }

    /**
     * tab 控制
     */
    var tab = $scope.tab = {
      list: [
        "项目详情",
        "项目信息",
        "评论",
      ],
      active: $routeParams.tabIndex||0,
      click: function(index){
        tab.active = index;
        $location.replace('/project-detail/:id', facId).search({tabIndex: index});
      }
    }
    $scope.adminList = {};
    $scope.$on("show-admin-list", (event, datas) => {
      tab.active = 'show-admin-list';
      $scope.adminList = datas;
    });
    $scope.$on("fac-ui-user-list.itemClick", (event, datas) => {
      if(!FacUser.isSysAdmin()) return
      // 只允许超级管理员操作
      FacUser.DjDialog.confirm(`此操作将从本项目中移除管理员“${datas.user.wxinfo && datas.user.wxinfo.nickname}”，移动后，将无法撤消。你确定？`, '移除管理员').then( () => {
        FacUser.SIGN.post('stee_user', 'remove_admin', {
          type  : 'steeproj',
          facid : facId,
          userid: datas.user.uid
        })
        .then( json => {
          $scope.adminList.uids = $scope.adminList.uids.filter(v => v.uid!=datas.user.uid);
        });
      })
    });
    $scope.$on("require-log-user-action", (event, datas) => {
      FacUser.logAction('steeproj', facId, datas.ac, userData.uid);
    });
  }
})(window, angular);