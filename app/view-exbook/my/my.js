'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    templateUrl: 'view-exbook/my/my.template.html',
    controller: ['$scope','$location','$log','ExbookService','AppbData','AppbUiService',
      function ($scope,$location,$log,ExbookService,AppbData,AppbUiService) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-back', '我的'); 
        AppbData.activeFooter('exbook-index');
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();

      }
    ]
  })
}]);

//___________________________________
})();
