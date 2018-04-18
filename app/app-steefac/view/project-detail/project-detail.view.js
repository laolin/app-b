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
      controller: ['$scope', '$routeParams', '$location', '$http', 'AppbData','$q', ctrl]
    });
  }]);

  function ctrl($scope, $routeParams, $location, $http, AppbData, $q) {
    var appData = AppbData.getAppData();
    var userData;
    var facid = $routeParams.id;
    var type = "steeproj";
    var pageCacheAc = `fac-detail-history-${type}`;

    /**
     * 初始化
     */
    var readObjDetail = $http.post('产能详情', { type, facid }).then(json => {
      var fac = json.datas.detail;
      $scope.fac = fac;
      $http.post("cache/load", { ac: pageCacheAc }).then(json => {
        var list = json.datas.data;
        if (!angular.isArray(list)) list = [];
        list = list.filter(id => id != facid);
        list = list.slice(-50);
        list.push(facid);
        $http.post("cache/save", { ac: pageCacheAc, data: list });
      }).catch(e => {
        console.log('读取历史记录 error:', e)
      });
    });
    var readUserInfo = $http.post("用户/个人信息").then(json => {
      userData = json.datas;
      console.log('个人信息, userData = ', userData)
    });

    $q.all([readObjDetail, readUserInfo]).then(()=>{
      resolveFac($scope.fac);
    }).catch(json => {
      //console.log('读取详情错误', json);
      return $location.path("/search").search({}).replace();
    });

    // 处理公司数据
    function resolveFac(fac) {
      appData.setPageTitleAndWxShareTitle(fac.name + '-详情');
      $http.post("地图/markObj", [fac, type]).catch(json => {
        console.log('地图/markObj 错误', json);
      });
      $scope.hidePoster = !userData.isSysAdmin;
      // 是否可以添加业绩
      $scope.canEdit = userData.isSysAdmin || userData.objAdmin[type] && userData.objAdmin[type].indexOf(facid);
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
        $location.replace('/project-detail/:id', facid).search({tabIndex: index});
      }
    }
    $scope.adminList = {};
    $scope.$on("show-admin-list", (event, datas) => {
      tab.active = 'show-admin-list';
      $scope.adminList = datas;
    });
    $scope.$on("fac-ui-user-list.itemClick", (event, datas) => {
      if (!userData.isSysAdmin) return
      // 只允许超级管理员操作
      $http.post("显示对话框/confirm", [
        `此操作将从本厂中移除管理员“${datas.user && datas.user.wxinfo && datas.user.wxinfo.nickname}”，移动后，将无法撤消。你确定？`, '移除管理员'
      ]).then(() => {
        return $http.post('stee_user/remove_admin', {
          type: type,
          facid: facid,
          userid: datas.uid
        });
      }).then(json => {
        $scope.adminList.uids = $scope.adminList.uids.filter(v => v.uid != datas.uid);
      });
    });

    $scope.$on("require-log-user-action", (event, datas) => {
      $http.post("操作记录/log", {
        k1: type,
        k2: facid,
        v1: datas.ac
      });
    });
  }

})(window, angular);