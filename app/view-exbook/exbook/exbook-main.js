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
         
        AppbData.activeHeader('exbook-home', '错题本'); 
        AppbData.activeFooter('exbook-index');

      }
    ]
  })
}]);

//___________________________________
})();
