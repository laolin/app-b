'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view-exbook/index/index.template.html',
    controller: ['$scope','$timeout','$log','ExbookService','AppbData','AppbUiService',
      function ($scope,$timeout,$log,ExbookService,AppbData,AppbUiService) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        var ebData=ExbookService.getEbData();
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        
        $scope.userData=userData;
        $scope.appData=appData;
        $scope.ebData=ebData;
        
         
        AppbData.activeHeader('exbook-back', '首页'); 
        AppbData.activeFooter('exbook-index');

        

      }
    ]
  })
}]);

//___________________________________
})();
