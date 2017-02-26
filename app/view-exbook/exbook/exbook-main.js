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
        
        //if(! userData || !userData.token) {
        //  return $location.path( "/wx-login" ).search({pageTo: '/'});
        //}

        $scope.logout=function() {
          //userData.token='';
          appData.setUserData({});
          //$location.path('/wx-login');
        }
         
        AppbData.activeHeader('exbook-home', '错题本'); 
        AppbData.activeFooter('exbook-index');

      }
    ]
  })
}]);

//___________________________________
})();
