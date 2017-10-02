'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/my-fac', {
templateUrl: 'app-steefac/my/my-fac.view.template.html',
controller: ['$scope','$log','AppbData','FacUser',
function ($scope,$log,AppbData,FacUser) {

  var userData=AppbData.getUserData();
  var appData=AppbData.getAppData();
  AppbData.activeHeader('home', '我的钢构厂'); 
  AppbData.activeFooter('index');
  
  //要求登录，如果未登录，会自动跳转到登录界面
  appData.requireLogin();

  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  // 使用 component 时
  //var ctrl=this;
  
  ctrl.FacUser=FacUser;
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

  
  ctrl.userData=userData;
  ctrl.appData=appData;
  

}]
})
}]);

//___________________________________
})();
