'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/search-proj', {
templateUrl: 'app-steefac/search/search.view.template.html',
controller: ['$scope','$http','$log','$location','AppbData','FacSearch','FacMap',
  function ($scope,$http,$log,$location,AppbData,FacSearch,FacMap) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }
    $scope.searchData=FacSearch;
    
    $scope.searchType = 'steeproj';
    

    
    var appData=AppbData.getAppData();
    
    AppbData.activeHeader('home', '搜索产能需求'); 
    $scope.$on('$viewContentLoaded', function () {
      FacSearch.showSearchMarkers(1,$scope.searchType);
    });
    $scope.$on('$destroy', function () {
      FacSearch.showSearchMarkers(0,$scope.searchType);
      FacSearch.hideInfoWindow();
    });
    
    
    
  }
//------------------------
]
});
}]);
