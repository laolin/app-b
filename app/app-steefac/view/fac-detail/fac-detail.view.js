/**
 * 公司详情页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {

  angular.module('steefac')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/fac-detail/:id', {
        pageTitle: "公司详情",
        templateUrl: 'app-steefac/view/fac-detail/fac-detail.template.html',
        controller: ['$scope', '$routeParams', '$location', '$http', 'AppbData', '$q', 'SiteConfig', ctrl]
      });
    }]);

  function ctrl($scope, $routeParams, $location, $http, AppbData, $q, SiteConfig) {
    var appData = AppbData.getAppData();
    var userData;
    var facid = $routeParams.id;
    var type = "steefac";
    var pageCacheAc = `fac-detail-history-${type}`;

    $scope.caseParam = {
      api: {
        comment: { root: SiteConfig.apiRootUnit + 'comment/comment/' },
        user: { root: '', me: '用户/个人信息', getWxInfo: '用户/微信数据' }
      },
      form: {
        items: [
          { name: 'projname', title: '项目名称', type: 'input', show: { autohide: "empty" }, param: { valid: { require: true }, placeholder: "在此输入项目名称" } },
          { name: 'weitu', title: '委托方', type: 'input', show: { autohide: "empty" }, param: { placeholder: "在此输入委托方（合同甲方）" } },
          { name: 'projplace', title: '项目地点', type: 'input', show: { autohide: "empty" }, param: { valid: { require: true }, placeholder: "在此输入项目地点" } },
          { name: 'doneyear', title: '完成年份', type: 'input', show: { autohide: "empty" }, param: { valid: { min:1900, max: new Date().getFullYear() }, placeholder: "完成年份" } },
          { name: 'projtype', title: '项目类型', type: 'dropdown', show: { autohide: "empty" }, param: { list: "stee-项目类别" } },
          { name: 'steetype', title: '钢构类别', type: 'dropdown', show: { autohide: "zero length" }, param: { list: "stee-擅长构件" } },
          { name: 'tons', title: '工程量', type: 'input', show: { autohide: "empty" }, param: { valid: { min: 0 }, placeholder: "在此输入工程量" } },
          { name: 'tons', title: '平均单吨价', type: 'input', show: { autohide: "empty" }, param: { valid: { min: 0 }, placeholder: "在此输入平均单吨" } },
          { name: 'projprize', title: '获奖', type: 'combobox', show: { autohide: "empty" }, param: { list: "stee-业绩获奖" } },
          { name: 'projclass', title: '工法', type: 'dropdown', show: { autohide: "empty" }, param: { list: "stee-业绩工法" } },
          { name: 'projpatent', title: '专利', type: 'input', show: { autohide: "zero length" }, param: { placeholder: "在此输入专利情况" } },
          { name: 'content', title: '简介', type: 'textarea', show: { autohide: "empty" }, param: { valid: { require: true }, placeholder: "在此发表评论" } },
          { name: 'pics', title: '图片', type: 'imgs-uploader', show: { autohide: "zero length" } },
        ],
        css: {
          host: "flex publish",
          host2: "",
          hostEdit: "box flex flex-top",
          hostShow: "flex-1",
          hostBodyShow: "flex-1 flex-top",
        },
      },
      module: 'steeFacCase',
      mid: facid
    };
    $scope.commentParam = {
      api: {
        comment: { root: SiteConfig.apiRootUnit + 'comment/comment/' },
        user: { root: '', me: '用户/个人信息', getWxInfo: '用户/微信数据' }
      },
      form: {
        items: [
          { name: 'star1', title: '交货期', type: 'star', param: { valid: { require: true } } },
          { name: 'star2', title: '质量', type: 'star', param: { valid: { require: true } } },
          { name: 'star3', title: '服务配合', type: 'star', param: { valid: { require: true } } },
          { name: 'star4', title: '安全管理', type: 'star', param: { valid: { require: true } } },
          { name: 'star5', title: '环保管理', type: 'star', param: { valid: { require: true } } },
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
      module: 'steeComment',
      mid: facid
    };
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
        "公司简介",
        "产能详情",
        "公司业绩",
        "评论",
      ],
      active: $routeParams.tabIndex || 0,
      click: function (index) {
        tab.active = index;
        history.replaceState(null, "", `#!/fac-detail/${facid}?tabIndex=${index}`);
        //$location.replace('/fac-detail/:id', facid).search({ tabIndex: index });
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