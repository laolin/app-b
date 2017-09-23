'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/search', {
templateUrl: 'app-steefac/search/search.template.html',
controller: ['$scope','$http','$log','$location','AppbData','FacSearch','FacMap',
  function ($scope,$http,$log,$location,AppbData,FacSearch,FacMap) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }
    $scope.searchData=FacSearch;

    
    var appData=AppbData.getAppData();
    
    AppbData.activeHeader('home', '查找钢构厂'); 
    $scope.$on('$viewContentLoaded', function () {
      FacMap.showSearchMarkers(1);
    });
    $scope.$on('$destroy', function () {
      FacMap.showSearchMarkers(0);
      FacMap.hideInfoWindow();
    });
    
    
    
  }
//------------------------
]
});
}]);
