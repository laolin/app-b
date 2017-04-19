'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    templateUrl: 'view-exbook/my/my.template.html',
    controller: ['$scope','$location','$log','ExbookService','AppbData','AppbUiService','AmapMainData',
      function ($scope,$location,$log,ExbookService,AppbData,AppbUiService,AmapMainData) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-home', '我的'); 
        AppbData.activeFooter('exbook-index');
        
        appData.mapData=AmapMainData.getMapData();
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        
        // 使用 component 时
        //var ctrl=this;
        
        
        $scope.$on('$viewContentLoaded', function () {
          ctrl.wxShareData_ori=angular.copy(appData.wxShareData);//备份wxShareData
          appData.wxShareData.title='错题本-我的';
          appData.wxShareData.desc='错题本-我的-说明';

        });
        $scope.$on('$destroy', function () {
          angular.extend(appData.wxShareData,ctrl.wxShareData_ori);//还原wxShareData
        });

        
        ctrl.userData=userData;
        ctrl.appData=appData;
        
        ctrl.swipeLeft=function() {
          appData.toastMsg('左滑',2);
        }
        ctrl.swipeRight=function() {
          appData.toastMsg('重登录',2);
          appData.setUserData({});
          appData.requireLogin();
        }
        
      }
    ]
  })
}]);

//___________________________________
})();
