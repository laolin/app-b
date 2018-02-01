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
      controller: ['$scope', '$routeParams', '$location', 'AppbData','$q','FacSearch','AppbAPI','FacUser', ctrl]
    });
  }]);

  function ctrl($scope, $routeParams, $location, AppbData,$q,FacSearch,AppbAPI,FacUser) {
    var facId = $routeParams.id;
    FacUser.getPageReadLimit('steeproj', facId)
    .then(show)
    .catch(info => {
      // 额度用完，跳到搜索页面
      $location.path( "/search" ).search({});
      //DjDialog.tips(info.text, 2000);
    });

    function show(){
      showPageAfterCount($scope, $routeParams, $location, AppbData,$q,FacSearch,AppbAPI,FacUser)
    }
  }
  function showPageAfterCount($scope, $routeParams, $location, AppbData,$q,FacSearch,AppbAPI,FacUser) {
    var appData=AppbData.getAppData();
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }
    var facId = $routeParams.id;
    /**
     * 初始化
     */
    $q.all([
      FacSearch.getDetail("steeproj", facId, true),
      FacUser.getMyData()
    ]).then(
      function(results){
        // 处理公司数据
        resolveFac(results[0]);
        // 是否管理员
        if(FacUser.isSysAdmin())$scope.canEdit=true;
      },
      function(e){
        console.log('detail Err',e);
        return appData.showInfoPage('获取数据错误',e,'/search')
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
        console.log('tab 控制', index);
        $location.replace('/project-detail/:id', facId).search({tabIndex: index});
      }
    }
    $scope.adminList = {};
    $scope.$on("show-admin-list", (event, datas) => {
      tab.active = 'show-admin-list';
      $scope.adminList = datas;
    });
  }
})(window, angular);