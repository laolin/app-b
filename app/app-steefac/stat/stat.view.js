'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stat', {
    templateUrl: 'app-steefac/stat/stat.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/my'});;
        }
        $scope.$on('$viewContentLoaded', function () {
        });
        $scope.$on('$destroy', function () {
        });

        
        $scope.abc=0;

      }
	]
  });
}]);
