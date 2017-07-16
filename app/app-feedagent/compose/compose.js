'use strict';
(function(){

angular.module('feedagent')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/compose', {
    templateUrl: 'app-feedagent/compose/compose.template.html',
    controller: ['$scope','$timeout','$log','$location','AppbFeedService','AppbData','AppbUiService',
      function ($scope,$timeout,$log,$location,AppbFeedService,AppbData,AppbUiService) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        var feedData=appData.feedData;
        $log.log('feedData @ /compose',feedData);
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        
        $scope.tabs=[
          {'text':'发表评论','link':'/compose',active:1},
          {'text':'浏览评论','link':'/explore'}
        ];
        $scope.userData=userData;
        $scope.appData=appData;
        $scope.feedData=feedData;
        $scope.feedApp='feedagent';
        $scope.feedCat='exbook';
        $scope.fcat=feedData.feedAppCat($scope.feedApp,$scope.feedCat);
        $scope.afterPublish=function(a) {
          $log.log('$scope.afterPublish at compose.js',a);
          
          $location.path( "/explore" );
          if(feedData.feedAll[$scope.fcat].length) {
            feedData.hasNewMore[$scope.fcat]=true;
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
         
        //AppbData.activeHeader('compose', '发表评论'); 
        //AppbData.activeFooter('index');
        
        var ctrl=this;
        $scope.$on('$viewContentLoaded', function () {
        });
        $scope.$on('$destroy', function () {
        });

        

      }
    ]
  })
}]);

//___________________________________
})();
