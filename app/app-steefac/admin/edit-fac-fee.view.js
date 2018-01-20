'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/edit-fac-fee', {
  pageTitle: "编辑加工费",
templateUrl: 'app-steefac/admin/edit-fac-fee.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacDefine','FacUser','FacSearch',
function ($scope,$http,$log,$location,
  AppbData,FacDefine,FacUser,FacSearch) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();

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
