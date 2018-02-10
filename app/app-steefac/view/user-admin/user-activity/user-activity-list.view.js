/**
 * 个人活跃度页面
 * ver: 0.0.1
 * build: 2018-02-03
 * power by LJH.
 */
!(function (window, angular, undefined){
  var thisLocationPath = "/user-activity-list";

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when(thisLocationPath, {
      pageTitle: "用户活跃度",
      requireLogin: 'super-admin',
      templateUrl: 'app-steefac/view/user-admin/user-activity/user-activity-list.template.html',
      controller: ['$scope', '$location', 'AppbData', 'FacUser', ctrl]
    });
  }]);

  function ctrl($scope, $location, AppbData, FacUser) {
    $scope.userData = FacUser;
    var appData=AppbData.getAppData();
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }
    var search = $location.search();
    var uid = search.uid;
    var from = parseInt(search.from) || 0; if(from < 15e8) from = 0;
    var to   = parseInt(search.to  ) || 0; if(to   < 15e8) to   = 0;
    var day  = parseInt(search.day ) || 0; day  = Math.max(0, day ); day  = Math.min(30, day );
    var hour = parseInt(search.hour) || 0; hour = Math.max(0, hour); hour = Math.min(24, hour);

    var param = $scope.param = from && {from, to} || hour && {hour} || day && {day} || {hour: 2};
    param.userid = uid;

    /**
     * 加载微信头像呢称
     */
    userData.requireWxInfo([uid])
    .then(arr => arr[0])
    .then(wxinfo =>{
      $scope.wxinfo = wxinfo;
    })

    /**
     * 加载活跃度数据
     */
    $scope.dataReady = false; // 正在加载标志
    FacUser.SIGN.post('sa_data', 'listUserLog', param)
    .then( json => json.datas.map(parseApiItem))
    .then( data => {
      $scope.dataReady = true;
      $scope.initPage(data);
    })

    /**
     * 显示 api 详情
     */
    $scope.showApiDetail = function(item){
      var body = Object.keys(item)
      .map( k => k + ": " + item[k])
      .join("\n");
      //FacUser.DjDialog.modal(body, '查看详情')
      FacUser.DjDialog.modal(`<div style="text-align:left">${body}</div>`, '查看详情')

    }

    /** 请求名称解析 */
    var theApiName = {
      steesys: {
        info: '个人信息',
      },
      stee_user: {
        apply_fac_admin: '申请成为管理员',
        apply_admin: '申请成为管理员',
        restore_admin: '恢复管理员',
        remove_admin: '移除管理员',
        me: '获得自己的权限',
        get_user_rights: '获得用户权限',
        get_admins: '获得所有的管理员',
        get_admin_of_fac: '获得一个fac的管理员',
        get_admin_of_obj: '获得所有的管理员',
      },
      steeobj: {
        add: '添加fac',
        detail: '获得fac详情',
        li: '获得多个详情',
        overview_addr: '全部的地址信息',
        search: '搜索fac',
        update: '更新fac详情',
        delete: '删除fac',
      },
      stee_msg: {
        presend: '模板消息预请求',
        send: '推送消息',
      },
      stee_data: {
        hash: '点击推送',
        logAction: '点击按钮',
      },
      sa_data: {
        getUserInfo: '获取用户信息',
        listUserLog: '多人活跃度',
      },
      wx: {
        get_users: '获得批量微信数据',
        get_openids: '获得批量微信id',
        jsapisign: '微信签名',
      },
      log: {
        n: '多用户活跃度',
        user: '单人活跃度',
        list_user: '单人活跃度',
        info: '个人信息',
      },
    };




    /** 单次请求解析 */
    function parseApiItem(item, index, arr){
      var preItem = index && arr[index - 1] || {};
      var preDate = preItem.date || '';
      item.sameDate = item.date == preDate? preItem.sameDate + 1 : 0;
      if(theApiName[item.api] && theApiName[item.api][item.call]){
        item.apiName = theApiName[item.api][item.call];
      }
      return item;
    }


    /**
     * 分页
     */
    !(function(){
      $scope.dataReady = false;
      $scope.list = [];
      var page = $scope.page = {
        ids: [],
        totle: 0,
        current: 0,
        minSize: 16,
        size: 0
      }
      $scope.initPage = (list) => {
        $scope.list = [];
        if(!list) return;
        page.totle = list.length || 0;
        page.size = 0;
        page.ids = list;
        $scope.loadMore(); // 加载一页
      }
      /**
       * 下拉刷新
       */
      $scope.isTopMost = true; // 是否滚动到最上边？若是，则隐藏“回到顶部”按钮
      $scope.allLoaded = 0; // 已全部加载，再下拉时，加1。用于动态改变底部提示文字
      $scope.checkTop = function(isTopMost){
        $scope.isTopMost = isTopMost;
      }
      $scope.loadMore = function(event, top, isTopMost){
        if($scope.list.length >= page.totle){
          $scope.allLoaded ++;
        }
        var b = $scope.list.length;
        var last = page.ids.length;
        for(var i = b; i< b+page.minSize && i< last; i++){
          $scope.list.push(page.ids[i]);
        }
      }
    })();
    

  }
})(window, angular);