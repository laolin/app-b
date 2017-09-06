'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'app-steefac/search/search.template.html',
    controller: ['$scope','$http','$log','$location','AppbData',
      function mzUserSearchCtrl($scope,$http,$log,$location,AppbData) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/mz-user.search'});;
        }

      }
	]
  });
}]);
