'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/search-fac', {
templateUrl: 'app-steefac/search/search.view.template.html',
controller: ['$scope','$http','$log','$location','AppbData','FacSearch','FacMap',
  function ($scope,$http,$log,$location,AppbData,FacSearch,FacMap) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }
    $scope.searchData=FacSearch;
    
    $scope.searchType = 'steefac';
    

    
    var appData=AppbData.getAppData();
    
    AppbData.activeHeader('home', '查找用钢项目信息'); 
    $scope.$on('$viewContentLoaded', function () {
      FacMap.showSearchMarkers(1,$scope.searchType);
    });
    $scope.$on('$destroy', function () {
      FacMap.showSearchMarkers(0,$scope.searchType);
      FacMap.hideInfoWindow();
    });
    
    
    
  }
//------------------------
]
});
}]);
