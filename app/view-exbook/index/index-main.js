'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view-exbook/index/index.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        $scope.userData=userData;
        $scope.appData=appData;
        
        //if(! userData || !userData.token) {
        //  return $location.path( "/wx-login" ).search({pageTo: '/'});
        //}

        $scope.logout=function() {
          //userData.token='';
          appData.setUserData({});//Update to localStorage
          //$location.path('/wx-login');
        }
         
        AppbData.activeHeader('exbook-back', '首页'); 
        AppbData.activeFooter('exbook-index');

      }
    ]
  })
}]);

//___________________________________
})();
