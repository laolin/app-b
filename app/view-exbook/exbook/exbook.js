'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/exbook', {
    templateUrl: 'view-exbook/exbook/exbook.template.html',
    controller: ['$scope','$location','$log','$q','ExbookService','AppbData',
      function ($scope,$location,$log,$q,ExbookService,AppbData) {

        var appData=AppbData.getAppData();
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
         
        AppbData.activeHeader('exbook-home', appData.appCfg.appName); 
        AppbData.activeFooter('exbook-index');
        var ctrl=this;
        $scope.$on('$viewContentLoaded', function () {
          ctrl.wxShareData_ori=angular.copy(appData.wxShareData);//备份wxShareData
          appData.wxShareData.title='我发现了一个题目';
          appData.wxShareData.desc='不管会不会做、想不想做，都来围观一下吧！';
          appData.wxShareData.link= location.href;

        });
        $scope.$on('$destroy', function () {
          angular.extend(appData.wxShareData,ctrl.wxShareData_ori);//还原wxShareData
        });
        
        $scope.appData=appData;
        $scope.ebData=appData.ebData;

        $scope.fid=$location.search()['fid'];
        
        if($scope.fid<=0) {
          $location.path('/explore');
          return;
        }

        appData.ebData.getFeed($scope.fid)
        .then(function(e){
          $log.log('appData.ebData.getFeed DONE res=',e,appData.ebData.feedOne);
          wx.ready(function () {
            appData.wxShareData.link= location.href;
            //题目内容：设为转发图文件消息的标题
            if(appData.ebData.feedOne.content) {
              appData.wxShareData.title='题目:'+appData.ebData.feedOne.content;
            }
            //如果题目有配图，设为图文消息的配图
            if(appData.ebData.feedOne.pics) {
              appData.wxShareData.imgUrl= appData.filePath+
               '/'+ appData.ebData.feedOne.pics.split(',')[0];
            }
            //appData.msgBox(appData.wxShareData.link,appData.ebData.feedOne.pics);
          });
        });
        if( !appData.ebData.feedList || !appData.ebData.feedList.length) {
          appData.ebData.exploreFeed();
        }



      }
    ]
  })
}]);

//___________________________________
})();
