/**
 * 用户活跃度页面
 * ver: 0.0.1
 * build: 2018-02-03
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/user-activity', {
      pageTitle: "用户活跃度",
      requireLogin: true,
      templateUrl: 'app-steefac/view/user-activity/user-activity.template.html',
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
    var day  = parseInt(search.day ) || 0; day  = Math.max(0, day ); day  = Math.min(30, day );
    var hour = parseInt(search.hour) || 0; hour = Math.max(0, hour); hour = Math.min(24, hour);

    var param = $scope.param = hour && {hour} || day && {day} || {hour: 2};

    $scope.loading = true; // 正在加载标志
    FacUser.SIGN.post('log', 'n', param)
    .then( json => {
      $scope.loading = false;
      console.log('用户活跃度', json);
      initPage(json.data);
    })

    /**
     * 分页
     */
    $scope.dataReady = false;
    $scope.list = [];
    var page = $scope.page = {
      ids: [],
      totle: 0,
      current: 0,
      minSize: 16,
      size: 0
    }
    function initPage(list){
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
      var ids = page.ids
      .filter( (item, index) =>{
        return index>=$scope.list.length && index<$scope.list.length+page.minSize
      })
      .map(item => item.uid);
      ids.length && FacUser.SIGN.post('wx', 'get_users/' + ids.join(','), {})
      .then( json => json.data)
      .then( list => {
        list.map( item => {
          var i = page.ids.findIndex( page_ids => item.uid == page_ids.uid );
          if(i >= 0){
            $scope.list[i] = {
              uid: item.uid,
              n: page.ids[i].n,
              uname: item.uname,
              wxinfo: item.wxinfo
            }
          }
        })
      })
    }
    
  }
})(window, angular);