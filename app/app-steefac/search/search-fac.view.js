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
    
    
    var appData=AppbData.getAppData();
    
    AppbData.activeHeader('home', '搜索产能地图'); 
    $scope.$on('$viewContentLoaded', function () {
      if(!FacMap.searchMarkers.length) 
        FacMap.selPositionStart('search','选点搜周边');
      FacSearch.showSearchMarkers(1,FacSearch.searchType);
      
    });
    $scope.$on('$destroy', function () {
      FacSearch.showSearchMarkers(0,FacSearch.searchType);
      FacSearch.hideInfoWindow();
      FacMap.selPositionEnd();
    });
    
    
    
  }
//------------------------
]
});
}]);
