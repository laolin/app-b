'use strict';
(function(){

angular.module('jia')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/serve-home', {
    templateUrl: 'app-jia/serve/serve-home.template.html',
    controller: ['$scope','$location','$log','$q','AppbFeedService','AppbData',
      function ($scope,$location,$log,$q,AppbFeedService,AppbData) {

        var appData=AppbData.getAppData();
        var feedData=appData.feedData;
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
         
        AppbData.activeHeader('home', '嘉空间主页'); 
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
        
        $scope.fid=$location.search()['fid'];

        $scope.appData=appData;
        $scope.feedData=feedData;
        $scope.feedApp='jia';
        $scope.feedCat='serve';
        $scope.fcat=feedData.feedAppCat($scope.feedApp,$scope.feedCat);

        $scope.serve=-1;//mark as not init
        if($scope.fid) {
          feedData.getFeed($scope.feedApp,$scope.feedCat,$scope.fid)
          .then(function(feed1){
            $scope.serve=feed1;
            if(feed1.pics) {
              $scope.imgs=feed1.pics.split(',');
            }
          },function(e){
            appData.toastMsg('ErrGetServe:'+e);
            $scope.serve=-2;//mark as Error init
          });
        } else {
          //不指定 fid, 自动获取最新的fid
          appData.feedData.exploreFeed($scope.feedApp,$scope.feedCat)
          .then(function(){
            var fcat=appData.feedData.feedAppCat($scope.feedApp,$scope.feedCat);
            var fds=appData.feedData.feedAll[fcat];
            if(!fds)
               $scope.serve=-2;//mark as Error init
            else {
              $scope.serve=fds[0];
              $scope.fid=fds[0].fid;
              $location.search({fid:fds[0].fid});
            }
          });
        }

        ctrl.swiper=false;
        



      }
    ]
  })
}]);

//___________________________________
})();
