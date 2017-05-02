'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/livec-create', {
    templateUrl: 'view-exbook/live-community/livec-create.template.html',
    controller: ['$scope','$timeout','$log','AppbData','AppbUiService','LivecData',
      function ($scope,$timeout,$log,AppbData,AppbUiService,LivecData) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-home', '创建小区'); 
        AppbData.activeFooter('exbook-index');
        
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        //if(!userData.isAdmin()) {
          //无权查看此页面
        //}

        var ctrl=this;
        
        
        $scope.$on('$viewContentLoaded', function () {
          ctrl.wxShareData_ori=angular.copy(appData.wxShareData);//备份wxShareData
          appData.wxShareData.title='创建小区';
          appData.wxShareData.desc='创建小区。';

        });
        $scope.$on('$destroy', function () {
          angular.extend(appData.wxShareData,ctrl.wxShareData_ori);//还原wxShareData
        });

        
        $scope.userData=userData;
        ctrl.appData=appData;
        appData.mapData.ready(function(){
          $scope.livecData=appData.livecData;
        });
        
      }
    ]
  })
}]);

//___________________________________
})();
