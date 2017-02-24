'use strict';
(function(){

angular.module('view-default')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view-default/default/default.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        AppbData.setHeader('欢迎','',-1,
          {side:'right',link:'/test-1',text:'test1'});

        AppbData.activeFooter('0');
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
      }
    ]
  })
}]);

//___________________________________
})();
