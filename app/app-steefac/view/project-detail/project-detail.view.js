/**
 * 项目详情页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {
  'use strict';

  angular.module('steefac')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/project-detail/:id', {
        pageTitle: "项目详情",
        templateUrl: 'app-steefac/view/project-detail/project-detail.template.html',
        controller: ['$scope', '$routeParams', '$location', '$http', 'AppbData', '$q', 'SiteConfig', ctrl]
      });
    }]);

  function ctrl($scope, $routeParams, $location, $http, AppbData, $q, SiteConfig) {
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
      $scope.role = json.datas.role || {};
      tab.setListByRole(!!fac.close_time, $scope.role);
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
    });

    $q.all([readObjDetail, readUserInfo]).then(() => {
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
        { text: '项目详情', name: 'profile' },
        { text: '项目信息', name: 'detail' },
        { text: '评论', name: 'comment' },
      ],
      active: $routeParams.tabIndex || 0,
      item: {},
      click: function (index, item) {
        tab.active = index;
        tab.item = item;
        $location.replace('/project-detail/:id', facid).search({ tabIndex: item.name });
      },
      setListByRole: function (closed, role) {
        if (!closed) {
          tab.list = [
            { text: '项目详情', name: 'profile' },
            { text: '项目信息', name: 'detail' },
            { text: '评论', name: 'comment' },
          ];
          tab.active = tab.list.findIndex(item => item.name == $routeParams.tabIndex);
          if (tab.active < 0) tab.active = 0;
          tab.item = tab.list[tab.active];
        }
        else if (!role || !(role.sa || role.admin)) {
          tab.list = []
          tab.item = { text: '关闭情况', name: 'close' },
          tab.active = 0;
        }
        else if (role.sa || role.admin) {
          tab.list = [
            { text: '关闭情况', name: 'close' },
            { text: '项目详情', name: 'profile' },
            { text: '项目信息', name: 'detail' },
            { text: '评论', name: 'comment' },
          ];
          tab.active = tab.list.findIndex(item => item.name == $routeParams.tabIndex);
          if (tab.active < 0) tab.active = 0;
          tab.item = tab.list[tab.active];
        }
        console.log("tab=", tab);
      }
    }
    $scope.commentParam = {
      api: {
        comment: { root: SiteConfig.apiRootUnit + 'comment/comment/' },
        user: { root: '', me: '用户/个人信息', getWxInfo: '用户/微信数据' }
      },
      form: {
        items: [
          { name: 'star1', title: '付款条件', type: 'star', show: { autohide: "empty" }, param: { valid: { require: true } } },
          { name: 'star2', title: '实际付款情况', type: 'star', show: { autohide: "empty" }, param: { valid: { require: true } } },
          { name: 'star3', title: '工期合理性', type: 'star', show: { autohide: "empty" }, param: { valid: { require: true } } },
          { name: 'star4', title: '指令合理性', type: 'star', show: { autohide: "empty" }, param: { valid: { require: true } } },
          { name: 'star5', title: '综合管理', type: 'star', show: { autohide: "empty" }, param: { valid: { require: true } } },
          { name: 'content', title: '评论', type: 'textarea', show: { autohide: "empty" }, param: { placeholder: "在此发表评论" } },
          { name: 'pics', title: '图片', show: { autohide: "zero length" }, type: 'imgs-uploader' },
        ],
        css: {
          host: "flex publish",
          host2: "",
          hostEdit: "box flex flex-top",
          hostShow: "flex-1",
          hostBodyShow: "flex-1 flex-top",
        },
      },
      module: 'steeProjComment',
      mid: facid
    };
    $scope.adminList = {};
    $scope.$on("show-admin-list", (event, datas) => {
      tab.active = 'show-admin-list';
      tab.item = {};
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

    $scope.$on("fac-close-changed", (event, datas) => {
      tab.setListByRole(datas.close == 'close', $scope.role);
      // 减少浪费资源
      event.preventDefault();
      event.stopPropagation();
    });

  }

})(window, angular);