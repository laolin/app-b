'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/home', {
templateUrl: 'app-steefac/home/home.view.template.html',
controller: ['$scope','$log','AppbData','AppbAPI','FacSearch','FacUser',
function ($scope,$log,AppbData,AppbAPI,FacSearch,FacUser) {

  var userData=AppbData.getUserData();
  var appData=AppbData.getAppData();
  appData.setPageTitle('首页');
  
  //要求登录，如果未登录，会自动跳转到登录界面
  appData.requireLogin();

  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  // 使用 component 时
  //var ctrl=this;
  
  ctrl.userData=userData;
  ctrl.appData=appData;
  ctrl.FacUser=FacUser;
  ctrl.isLoading=3;

  FacUser.getMyData().then(function (me) {
    ctrl.isLoading--;
  });
  
  ctrl.type1='steefac';
  AppbAPI('steeobj','search',{type:ctrl.type1,count:12}).then(
    function(s){
      ctrl.facList1=s;
      ctrl.title1='最新钢构厂能';
      ctrl.isLoading--;  
    }
  );
  
  ctrl.type2='steeproj';
  AppbAPI('steeobj','search',{type:ctrl.type2,count:9}).then(
    function(s){
      ctrl.facList2=s;
      ctrl.title2='最新项目信息';
      ctrl.isLoading--;  
    }
  );
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

  
  

}]
})
}]);

//___________________________________
})();
