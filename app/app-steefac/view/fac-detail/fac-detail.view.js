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
      templateUrl: 'app-steefac/view/fac-detail/fac-detail.template.html',
      controller: ['$scope', '$routeParams', '$location', 'AppbData','$q','FacSearch','AppbAPI','FacUser', ctrl]
    });
  }]);

  function ctrl($scope, $routeParams, $location, AppbData,$q,FacSearch,AppbAPI,FacUser) {
    var appData=AppbData.getAppData();
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }
    appData.setPageTitle('公司详情');
    var facId = $routeParams.id;
    /**
     * 初始化
     */
    $q.all([
      FacSearch.getDetail("steefac", facId, true),
      FacUser.getMyData()
    ]).then(
      function(results){
        // 处理公司数据
        resolveFac(results[0]);
      },
      function(e){
        console.log('detail Err',e);
        return appData.showInfoPage('获取数据错误',e,'/search')
      }
    );
    // 处理公司数据
    function resolveFac(fac){
      appData.setPageTitle(fac.name+'-详情');
      $scope.fac = fac;
      FacSearch.markObj(fac, 'steefac');
      $scope.hidePoster = !FacUser.isSysAdmin();
      // 是否管理员
      $scope.canEdit = FacUser.canAdminObj('steefac', fac.id);
    }

    /**
     * tab 控制
     */
    var tab = $scope.tab = {
      list: [
        "公司简介",
        "产能详情",
        {text: "公司业绩", disabled: true},
        "评论",
      ],
      active: $routeParams.tabIndex||0,
      click: function(index){
        tab.active = index;
        console.log('tab 控制', index);
        $location.replace('/fac-detail/:id', facId).search({tabIndex: index});
      }
    }
  }
})(window, angular);