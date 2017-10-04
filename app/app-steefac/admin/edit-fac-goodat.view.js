'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/edit-fac-goodat', {
templateUrl: 'app-steefac/admin/edit-fac-goodat.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacDefine','FacApi','FacUser','FacSearch',
function ($scope,$http,$log,$location,
  AppbData,FacDefine,FacApi,FacUser,FacSearch) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();
  appData.setPageTitle('编辑擅长构件');

  var search=$location.search();
  $scope.id=parseInt(search.id);
  $scope.isLoading=0;
  
  //==================

  

  


  
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
