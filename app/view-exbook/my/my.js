'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    templateUrl: 'view-exbook/my/my.template.html',
    controller: ['$scope','$location','$log','ExbookService','AppbData','AppbUiService',
      function ($scope,$location,$log,ExbookService,AppbData,AppbUiService) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-home', '我的'); 
        AppbData.activeFooter('exbook-index');
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        
        // 使用 component 时
        //var ctrl=this;
        ctrl.userData=userData;
        ctrl.appData=appData;
        
        ctrl.swipeLeft=function() {
          appData.toastMsg('左滑',2);
        }
        ctrl.swipeRight=function() {
          appData.toastMsg('右滑',2);
        }
        
      }
    ]
  })
}]);

//___________________________________
})();
