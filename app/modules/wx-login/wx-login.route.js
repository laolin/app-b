'use strict';
(function(){
var MARK_API_CALLBACK='cb_xd';//和后端API的约定字符串

angular.module('wx-login')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wx-callback', {
    template:'<wx-login-callback app-data="appb.appData"></wx-login-callback>',
    controller: ['$scope','$log','$location','$http',
      function($scope,$log,$location,$http) {
      }
    ]
  })//qgsMainAppDataUser
  .when('/wx-login', {
    template: '<wx-login-auth app-data="appb.appData" page-to="pageTo">login...</wx-login-auth>',
    controller: ['$scope','$location','$log','$interval',
      function($scope,$location,$log,$interval) {
        $scope.pageTo=$location.search().pageTo;
      }
	  ]
  });
}]);

//________________________
})();
