'use strict';
(function(){

angular.module('view-test')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test-1', {
    templateUrl: 'view-test/test/test-1.template.html',
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
         
        AppbData.setHeader('TEST-1aaa','',0,
          {side:'right',link:'/test-2',text:'test2'}); 
        AppbData.activeFooter('test');

      }
    ]
  })
}]);

//___________________________________
})();
