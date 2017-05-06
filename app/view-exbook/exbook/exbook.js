'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/exbook', {
    templateUrl: 'view-exbook/exbook/exbook.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        $scope.userData=userData;
        $scope.appData=appData;
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
         
        AppbData.activeHeader('exbook-home', appData.appCfg.appName); 
        AppbData.activeFooter('exbook-index');
        var ctrl=this;
        $scope.$on('$viewContentLoaded', function () {
          ctrl.wxShareData_ori=angular.copy(appData.wxShareData);//备份wxShareData
          appData.wxShareData.title='我发现了这里有好多题目，速来围观。';
          appData.wxShareData.desc='这题你会做么？';
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
