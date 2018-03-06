'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/admin-show-activety', {
  pageTitle: "查看活跃度",
templateUrl: 'app-steefac/admin/admin-show-activety.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacUser',
function ($scope,$http,$log,$location,
  AppbData,FacUser) {
  var userData=AppbData.getUserData();
  
  var ctrl=$scope.$ctrl={};
  
  ctrl.FacUser=FacUser;
  ctrl.isLoading=0;
  ctrl.msg='Ready';
  
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
