'use strict';
(function(){

angular.module('jia')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/serve-create', {
    templateUrl: 'app-jia/serve/serve-create.template.html',
    controller: ['$scope','$location','$log','$q','AppbFeedService','AppbData',
      function ($scope,$location,$log,$q,AppbFeedService,AppbData) {

        var appData=AppbData.getAppData();
        var feedData=appData.feedData;
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
         
        AppbData.activeHeader('home', '创建服务'); 
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
        $scope.feedData=feedData;
        $scope.feedApp='jia';
        $scope.feedCat='serve';
        $scope.fcat=feedData.feedAppCat($scope.feedApp,$scope.feedCat);
        $scope.onPublish=function(a) {
          $log.log('$scope.onPublish serve-created!->',a);
        }        

        if(!feedData.draftAll[$scope.fcat]) {
          feedData.initDraft($scope.feedApp,$scope.feedCat).then(function(){
            $scope.feed=feedData.draftAll[$scope.fcat];
          });
        } else {
          $scope.feed=feedData.draftAll[$scope.fcat];
        }


      }
    ]
  })
}]);

//___________________________________
})();
