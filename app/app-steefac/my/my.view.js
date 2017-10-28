'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    templateUrl: 'app-steefac/my/my.view.template.html',
    controller: ['$scope','$timeout','$log','AppbFeedService','AppbData','AppbUiService','AmapMainData','FacUser',
      function ($scope,$timeout,$log,AppbFeedService,AppbData,AppbUiService,AmapMainData,FacUser) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        appData.setPageTitle('我的');
        
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        
        // 使用 component 时
        //var ctrl=this;
        
        ctrl.FacUser=FacUser;
        
        $scope.$on('$viewContentLoaded', function () {
        });
        $scope.$on('$destroy', function () {
        });

        
        ctrl.userData=userData;
        ctrl.appData=appData;
        ctrl.onDisableSysAdmin=function() {
          var me;
          me=appData.userData.wxinfo;
          me.nickname='请高手用户';
          me.headimgurl='https://api.qinggaoshou.com/api-eb/uploads/wx_ee6518de6283518eac17ba8d10eb5da41947f3a2.jpg';
          
          me=appData.userData.usersInfo[appData.userData.uid];
          if(me) {
            me.wxinfo.nickname='请高手用户';
            me.wxinfo.headimgurl='https://api.qinggaoshou.com/api-eb/uploads/wx_ee6518de6283518eac17ba8d10eb5da41947f3a2.jpg';
          }
        }
        
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
