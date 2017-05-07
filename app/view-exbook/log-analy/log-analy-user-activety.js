'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/log-analy-user-activety', {
    templateUrl: 'view-exbook/log-analy/log-analy-user-activety.template.html',
    controller: ['$scope','$location','$log','AppbLogService','AppbData','AppbUiService','AmapMainData',
      function ($scope,$location,$log,AppbLogService,AppbData,AppbUiService,AmapMainData) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-home', '用户活跃度'); 
        AppbData.activeFooter('exbook-index');
        
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        
        // 使用 component 时
        //var ctrl=this;
        ctrl.userData=userData;
        ctrl.logData=appData.logData;
        
        var search=$location.search();
        var para={};
        var day=parseInt(search.day);
        var hour=parseInt(search.hour);
        if(isNaN(day))day=0;
        if(isNaN(hour))hour=0;
        day=Math.max(0,day);
        day=Math.min(30,day);
        hour=Math.max(0,hour);
        hour=Math.min(24,hour);
        if(hour==0 && day==0) {
          hour=2;
        }
        if(day) {
          para.day=day;
        }
        if(hour) {
          para.hour=hour;
        }
        ctrl.day=day;
        ctrl.hour=hour;
        
        ctrl.logData.getLogActivity(para).then(function(s){
          $log.log('OK-logData.getLogActivity',s);
        },function(e){
          $log.log('E-logData.getLogActivity',e);
        });
        
        
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
