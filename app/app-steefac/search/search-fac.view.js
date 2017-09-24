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
    
    AppbData.activeHeader('home', '搜索钢构产能'); 
    $scope.$on('$viewContentLoaded', function () {
      FacMap.showSearchMarkers(1,$scope.searchType);
      FacMap.getSelMarker().then(function(m){
        FacMap.selPositionStart('search');
      });

    });
    $scope.$on('$destroy', function () {
      FacMap.showSearchMarkers(0,$scope.searchType);
      FacMap.hideInfoWindow();
      FacMap.selPositionEnd();
    });
    
    
    
  }
//------------------------
]
});
}]);
