/**
 * 公司详情页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/fac-detail/:id', {
      pageTitle: "公司详情",
      templateUrl: 'app-steefac/view/fac-detail/fac-detail.template.html',
      controller: ['$scope', '$routeParams', '$location', '$http', 'AppbData','$q','FacSearch','FacUser', ctrl]
    });
  }]);

  function ctrl($scope, $routeParams, $location, $http, AppbData,$q,FacSearch,FacUser) {
    var appData=AppbData.getAppData();
    var userData=AppbData.getUserData();
    var facId = $routeParams.id;
    /**
     * 初始化
     */
    $q.all([
      FacUser.readObjDetail("steefac", facId),
      FacUser.getMyData()
    ]).then(
      function(results){
        // 处理公司数据
        return FacUser.preReadDetail('steefac', facId, results[0].data).then(fac => {
          resolveFac(fac);

          $http.post("cache/load", { ac: "view-steefac" }).then(json => {
            var list = json.datas.data;
            if (!angular.isArray(list)) list = [];
            list = list.slice(-50);
            console.log('读取历史记录 :', json, list, [facId])
            list = list.filter(id => id != facId);
            console.log('新记录 :', list)
            list.push(facId);
            $http.post("cache/save", { ac: "view-steefac", data: list })
              .then(json => {
                console.log('保存记录 :', json)
              })
              .catch(json => {
                console.log('保存记录错误 :', json)
              })
              ;
          }).catch(e => {
            console.log('读取历史记录 error:', e)
          });
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
      FacSearch.markObj(fac, 'steefac');
      $scope.hidePoster = !FacUser.isSysAdmin();
      // 是否可以添加业绩
      $scope.canEdit = FacUser.canAdminObj('steefac', fac.id) || FacUser.isSysAdmin();
    }

    /**
     * tab 控制
     */
    var tab = $scope.tab = {
      list: [
        "公司简介",
        "产能详情",
        "公司业绩",
        "评论",
      ],
      active: $routeParams.tabIndex||0,
      click: function(index){
        tab.active = index;
        $location.replace('/fac-detail/:id', facId).search({tabIndex: index});
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
      FacUser.DjDialog.confirm(`此操作将从本厂中移除管理员“${datas.user && datas.user.wxinfo && datas.user.wxinfo.nickname}”，移动后，将无法撤消。你确定？`, '移除管理员').then( () => {
        FacUser.SIGN.post('stee_user', 'remove_admin', {
          type  : 'steefac',
          facid : facId,
          userid: datas.uid
        })
        .then( json => {
          $scope.adminList.uids = $scope.adminList.uids.filter(v => v.uid!=datas.uid);
        });
      })
    });

    $scope.$on("require-log-user-action", (event, datas) => {
      console.log('收到记录用户请求', datas, userData);
      FacUser.logAction('steefac', facId, datas.ac, userData.uid);
    });
  }
})(window, angular);