'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/compose', {
    templateUrl: 'view-exbook/compose/compose.template.html',
    controller: ['$scope','$timeout','$log','AppbFeedService','AppbData','AppbUiService',
      function ($scope,$timeout,$log,AppbFeedService,AppbData,AppbUiService) {
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
        
        if(!feedData.draftAll[$scope.fcat]) {
          feedData.initDraft($scope.feedApp,$scope.feedCat);
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
