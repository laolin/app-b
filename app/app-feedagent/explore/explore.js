'use strict';
(function(){

angular.module('feedagent')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/explore', {
    templateUrl: 'app-feedagent/explore/explore.template.html',
    controller: ['$scope','$http','$log','AppbFeedService','AppbData',
      function ($scope,$http,$log,AppbFeedService,AppbData) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        //AppbData.activeHeader('explore', '浏览评论'); 
        //AppbData.activeFooter('index');

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        // 使用 component 时
        //var ctrl=this;

        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        
        $scope.$on('$viewContentLoaded', function () {
          

        });
        $scope.$on('$destroy', function () {
          
        });

        ctrl.tabs=[
          {'text':'发表评论','link':'/compose'},
          {'text':'浏览评论','link':'/explore',active:1}
        ];
        ctrl.userData=userData;
        ctrl.appData=appData;
        ctrl.feedApp='feedagent';
        ctrl.feedCat='exbook';
        ctrl.fcat=appData.feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
        var feeds=appData.feedData.feedAll[ctrl.fcat];
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
