'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/search', {
templateUrl: 'app-steefac/search/search.template.html',
controller: ['$scope','$http','$log','$location','AppbData','FacSearch',
  function mzUserSearchCtrl($scope,$http,$log,$location,AppbData,FacSearch) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }
    $scope.searchData=FacSearch;

    
    var appData=AppbData.getAppData();
    
  }
//------------------------
]
});
}]);
