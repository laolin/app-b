/**
 * 用户活跃度页面
 * ver: 0.0.1
 * build: 2018-02-03
 * power by LJH.
 */
!(function (window, angular, undefined){
  var thisLocationPath = "/user-activity";

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when(thisLocationPath, {
      pageTitle: "用户活跃度",
      requireLogin: 'super-admin',
      templateUrl: 'app-steefac/view/user-admin/user-activity/user-activity.template.html',
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
    var from = parseInt(search.from) || 0; if(from < 15e8) from = 0;
    var to   = parseInt(search.to  ) || 0; if(to   < 15e8) to   = 0;
    var day  = parseInt(search.day ) || 0; day  = Math.max(0, day ); day  = Math.min(30, day );
    var hour = parseInt(search.hour) || 0; hour = Math.max(0, hour); hour = Math.min(24, hour);

    var param = $scope.param = from && {from, to} || hour && {hour} || day && {day} || {hour: 2};
    $scope.searchParam = (uid) => {
      return JSON.stringify(angular.extend({uid}, param));
    }

    $scope.loading = true; // 正在加载标志
    FacUser.SIGN.post('log', 'n', param)
    .then( json => json.data.filter(item => +item.uid>0))
    .then( data => {
      $scope.loading = false;
      initPage(data);
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
    $scope.loadMore = function(){
      console.log('要加载...')
      if($scope.list.length >= page.totle){
        $scope.allLoaded ++;
      }
      var b = $scope.list.length;
      var e = Math.min($scope.list.length + page.minSize, page.ids.length);
      var userids = page.ids
      .filter( (item, index) =>{
        return index >= b && index < e
      })
      .map(item => item.uid);
      return userData.requireWxInfo(userids)
      .then( list => {
        for(var i=b; i<e; i++){
          var item = list.find(a => a.uidBinded == page.ids[i].uid);
          if(item){
            $scope.list.push(angular.extend({n: page.ids[i].n}, item));
          }
          else{
            // 标志此人不存在
            page.ids[i] = '';
          }
        }
        // 过滤不存在的用户
        page.ids = page.ids.filter(item => !!item);
        page.totle = page.ids.length;
      })
      .catch(e =>{
        console.error('加载错误：', e);
      });
    }
    

    /**
     * 对话框
     */
    !(() => {
      var now = Math.floor(+new Date()/6e4);
      function dTime(ms){
        var d = new Date();
        d.setTime(ms);
        return d;
      }
      var form = $scope.form = {
        quickValue: {},
        between: {
          from: dTime(from * 1000 || (now - 24 * 60) * 6e4),
          to  : dTime(to   * 1000 || now * 6e4)
        },
        quickList : [
          {text: '1小时', value: {hour: 1}},
          {text: '2小时', value: {hour: 2}},
          {text: '12小时', value: {hour: 12}},
          {text: '24小时', value: {hour: 24}},
          {text: '1天', value: {day: 1}},
          {text: '2天', value: {day: 2}},
          {text: '1星期', value: {day: 7}},
          {text: '2星期', value: {day: 14}},
          {text: '1个月', value: {day: 30}},
        ]
      }
      $scope.$watch("form.quickValue", (v) =>{
        console.log('quickValue改变：', v, typeof(v))
      })
      $scope.$watch("form.between.from", (v) =>{
        var b = +v || 0;
        var e = +form.between.to   || 0;
        if(b > e){
          form.between.to = dTime(b + 7200000)
        }
      })
      $scope.$watch("form.between.to", (v) =>{
        var b = +form.between.from || 0;
        var e = +v   || 0;
        if(b > e){
          form.between.from = dTime(e - 7200000)
        }
      })
      $scope.showDialog = () =>{
        $scope.showing = true;
      }
      $scope.onClose = (btName) =>{
        if(btName !== "OK") return;
        if(tab.active == 0){
          $location.path(thisLocationPath).search(form.quickValue).replace();
        }
        if(tab.active == 1){
          var param ={
            from : Math.floor(+form.between.from / 1000),
            to   : Math.floor(+form.between.to   / 1000)
          }
          $location.path(thisLocationPath).search(param).replace();
        }
      }
    
      /**
       * tab 控制
       */
      var tab = $scope.tab = {
        list: [
          "快速选择",
          "自定义",
        ],
        active: 0,
        click: function(index){
          tab.active = index;
        }
      }

    })();

  }
})(window, angular);