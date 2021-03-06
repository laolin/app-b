'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/compose', {
    templateUrl: 'app-exbook/compose/compose.template.html',
    controller: ['$scope','$timeout','$log','$location','AppbFeedService','AppbData','AppbUiService',
      function ($scope,$timeout,$log,$location,AppbFeedService,AppbData,AppbUiService) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        var feedData=appData.feedData;
        $log.log('feedData @ /compose',feedData);
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        
        $scope.userData=userData;
        $scope.appData=appData;
        $scope.feedData=feedData;
        $scope.feedApp='exbook';
        $scope.feedCat='exbook';
        $scope.fcat=feedData.feedAppCat($scope.feedApp,$scope.feedCat);
        $scope.afterPublish=function(a) {
          $log.log('$scope.afterPublish at compose.js',a);
          
          $location.path( "/explore" );
          if(feedData.feedAll[$scope.fcat]&&feedData.feedAll[$scope.fcat].length) {
            feedData.hasNewMore['exbook.exbook']=true;
            feedData.exploreFeed($scope.feedApp,$scope.feedCat,{newMore:1});//自动刷新新帖
          }//原先没有任何feed时,跳到/explore后会自己取，故不需要刷新新帖
        }
        
        if(!feedData.draftAll[$scope.fcat]) {
          feedData.initDraft($scope.feedApp,$scope.feedCat).then(function(){
            $scope.feed=feedData.draftAll[$scope.fcat];
          });
        } else {
          $scope.feed=feedData.draftAll[$scope.fcat];
        }
         
        AppbData.activeHeader('exbook-back', '发布题目'); 
        AppbData.activeFooter('exbook-index');
        
        var ctrl=this;
        $scope.$on('$viewContentLoaded', function () {
          ctrl.wxShareData_ori=angular.copy(appData.wxShareData);//备份wxShareData
          appData.wxShareData.title='我发现了这里有好多题目，速来围观';
          //appData.appCfg.appName;
          appData.wxShareData.desc='今天你做题了么？';
          appData.wxShareData.link=location.href;

        });
        $scope.$on('$destroy', function () {
          angular.extend(appData.wxShareData,ctrl.wxShareData_ori);//还原wxShareData
        });

        

      }
    ]
  })
}]);

//___________________________________
})();
