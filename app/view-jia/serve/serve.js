'use strict';
(function(){

angular.module('jia')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/serve', {
    templateUrl: 'view-jia/serve/serve.template.html',
    controller: ['$scope','$location','$log','$q','AppbFeedService','AppbData',
      function ($scope,$location,$log,$q,AppbFeedService,AppbData) {

        var appData=AppbData.getAppData();
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
         
        AppbData.activeHeader('home', appData.appCfg.appName); 
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
        $scope.feedData=appData.feedData;




      }
    ]
  })
}]);

//___________________________________
})();
