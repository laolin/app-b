'use strict';
(function(){

angular.module('jia')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/serve-edit', {
    templateUrl: 'app-jia/serve-admin/serve-edit.template.html',
    controller: ['$scope','$location','$log','$q','AppbFeedService','AppbData',
      function ($scope,$location,$log,$q,AppbFeedService,AppbData) {

        var appData=AppbData.getAppData();
        var feedData=appData.feedData;
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        $scope.fid=$location.search()['fid'];
        
        if($scope.fid)AppbData.activeHeader('home', '修改服务'); 
        else AppbData.activeHeader('home', '创建服务'); 
        AppbData.activeFooter('index');
        var ctrl=this;
        $scope.$on('$viewContentLoaded', function () {
          ctrl.wxShareData_ori=angular.copy(appData.wxShareData);//备份wxShareData
          //appData.wxShareData.title='';
          //appData.wxShareData.desc='';
          appData.wxShareData.link= location.href;

        });
        $scope.$on('$destroy', function () {
          angular.extend(appData.wxShareData,ctrl.wxShareData_ori);//还原wxShareData
        });
        
        $scope.appData=appData;
        $scope.isAdmin=appData.userData.isAdmin()
        $scope.feedData=feedData;
        $scope.feedApp='jia';
        $scope.feedCat='serve';
        $scope.fcat=feedData.feedAppCat($scope.feedApp,$scope.feedCat);
        $scope.afterPublish=function(a) {
          $location.url('/serve-list?admin=1');
          feedData.hasNewMore[$scope.fcat]=true;
          feedData.exploreFeed($scope.feedApp,$scope.feedCat,{newMore:1});//自动刷新新帖
        }
                
        if($scope.fid) {
          feedData.getFeed($scope.feedApp,$scope.feedCat,$scope.fid)
          .then(function(feed1){
            $scope.feed=feed1;
            _init_access_value();
            $log.log('i-1',$scope.feed);
          },function(e){
            appData.toastMsg('ErrFeed:'+e);
          });
        } else if(!feedData.draftAll[$scope.fcat]) {
          feedData.initDraft($scope.feedApp,$scope.feedCat).then(function(){
            $scope.feed=feedData.draftAll[$scope.fcat];
            _init_access_value();
            $log.log('i-2',$scope.feed);
          });
        } else {
          $scope.feed=feedData.draftAll[$scope.fcat];
          _init_access_value();
            $log.log('i-3',$scope.feed);
        }
        function _init_access_value() {
          $log.log('testing: access');
          if(0x10000 != +$scope.feed.access) {
            feedData.changeFeedAccess($scope.feedApp,$scope.feedCat,$scope.feed.fid,0x10000)
            .then(function(s){
              $scope.feed.access=0x10000;
              $log.log('re define access');
            },function(e){});
          }
        }

      }
    ]
  })
}]);

//___________________________________
})();
