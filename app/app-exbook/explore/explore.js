'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/explore', {
    templateUrl: 'app-exbook/explore/explore.template.html',
    controller: ['$scope','$http','$log','AppbFeedService','AppbData',
      function ($scope,$http,$log,AppbFeedService,AppbData) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-home', '发现'); 
        AppbData.activeFooter('exbook-index');

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        // 使用 component 时
        //var ctrl=this;

        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        
        $scope.$on('$viewContentLoaded', function () {
          ctrl.wxShareData_ori=angular.copy(appData.wxShareData);//备份wxShareData
          appData.wxShareData.title='我发现了这里有好多题目，速来围观。';
          appData.wxShareData.desc='这题你会做么？';
          appData.wxShareData.link=location.href;

        });
        $scope.$on('$destroy', function () {
          angular.extend(appData.wxShareData,ctrl.wxShareData_ori);//还原wxShareData
        });

        
        ctrl.userData=userData;
        ctrl.appData=appData;
        ctrl.feedApp='exbook';
        ctrl.feedCat='exbook';
        ctrl.fcat='exbook.exbook';
        var feeds=appData.feedData.feedAll[appData.feedData.feedAppCat('exbook','exbook')];
        if( !feeds || !feeds.length) {
          appData.feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat);
        }
        ctrl.showNewMore=function(){
            appData.feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat,{newMore:1});
        }
        ctrl.showOldMore=function(){
          if(!appData.feedData.hasOldest[ctrl.fcat])
            appData.feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat,{oldMore:1});
        }

        
        
      }
    ]
  })
}]);

//___________________________________
})();
