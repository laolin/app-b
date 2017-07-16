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
            init_all_draft();
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
        function init_all_draft(){
          $scope.cm_app='jia_serve_comment';
          $scope.cm_cat='serveid_'+$scope.serve.fid;
          feedData.exploreFeed($scope.cm_app,$scope.cm_cat);//获取评论
          feedData.initDraft($scope.cm_app,$scope.cm_cat)
          .then(function(s){
              $scope.jiaComment=s;
          },function(e){});

          $scope.trade_app='jia_trade';
          $scope.trade_cat='serveid_'+$scope.serve.fid;
          feedData.initDraft($scope.trade_app,$scope.trade_cat)
          .then(function(s){
              $scope.jiaTrade=s;
          },function(e){});
        }
        
        $scope.afterComment=function(feed) {
          $log.log(feed);
          feedData.hasNewMore[$scope.cm_fcat]=true;
          feedData.exploreFeed($scope.cm_app,$scope.cm_cat,{newMore:1});//自动刷新新帖
        }
        $scope.afterTrade=function(feed) {
          $log.log('afterTrade',feed);
        }
        
        
        $scope.isOrdering=false;
        $scope.order=function() {
          $scope.isOrdering=!$scope.isOrdering;
        }

      }
    ]
  })
}]);

//___________________________________
})();
