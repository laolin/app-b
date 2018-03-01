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
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();
  //要求登录，如果未登录，会自动跳转到登录界面
  appData.requireLogin();
  
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
