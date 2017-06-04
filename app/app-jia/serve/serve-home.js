'use strict';
(function(){

angular.module('jia')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/serve-home', {
    templateUrl: 'app-jia/serve/serve-home.template.html',
    controller: ['$scope','$location','$log','$interval','AppbFeedService','AppbData',
      function ($scope,$location,$log,$interval,AppbFeedService,AppbData) {

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
            
            $interval(calTime,78);
            if(feed1.pics) {
              $scope.imgs=feed1.pics.split(',');
            } else {
              //TODO 没有图片时待更好地处理
              $scope.imgs=['jkjlogo.jpg','jkjlogo.jpg'];
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

        


        function calTime() {
            $scope.timeDiff=new Date($scope.serve.attr.promoEnd)-new Date();

            
            $scope.timeDay=Math.floor($scope.timeDiff/1000/3600/24);
            $scope.timeHour=Math.floor($scope.timeDiff/1000/3600)-$scope.timeDay*24;
            $scope.timeMin= Math.floor(($scope.timeDiff % (3600*1000))/60000);
            $scope.timeSec= Math.floor(($scope.timeDiff % (60*1000))/1000);
            $scope.timeMsec= Math.floor(($scope.timeDiff % 1000)/10);
        }
        
        $scope.cm_app='jia';
        $scope.cm_cat='comment';
        $scope.cm_fcat=feedData.feedAppCat($scope.cm_app,$scope.cm_cat);
        $scope.commentForm=false;
        feedData.exploreFeed($scope.cm_app,$scope.cm_cat);//获取评论
        if(feedData.draftAll[$scope.cm_fcat]) {
          $scope.jiaComment=feedData.draftAll[$scope.cm_fcat];
        } else {
          feedData.initDraft($scope.cm_app,$scope.cm_cat).then(function(){
            $scope.jiaComment=feedData.draftAll[$scope.cm_fcat];
          });
        }
        $scope.afterComment=function(feed) {
          $log.log(feed);
          feedData.hasNewMore[$scope.cm_fcat]=true;
          feedData.exploreFeed($scope.cm_app,$scope.cm_cat,{newMore:1});//自动刷新新帖
        }
        $scope.showComment=function() {
          $scope.commentForm=!$scope.commentForm;
        }

      }
    ]
  })
}]);

//___________________________________
})();
