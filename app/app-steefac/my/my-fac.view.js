'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/my-fac', {
  pageTitle: "我管理的钢构厂",
templateUrl: 'app-steefac/my/my-fac.view.template.html',
controller: ['$scope','$log','AppbData','FacSearch','FacUser',
function ($scope,$log,AppbData,FacSearch,FacUser) {

  var userData=AppbData.getUserData();
  var appData=AppbData.getAppData();
  
  //要求登录，如果未登录，会自动跳转到登录界面
  appData.requireLogin();

  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  // 使用 component 时
  //var ctrl=this;
  
  ctrl.FacUser=FacUser;
  ctrl.isLoading=1;
  ctrl.objTypes=FacSearch.objTypes;
  ctrl.objNames=FacSearch.objNames;
  ctrl.facIds={};
  ctrl.noIds=true;
 
  FacUser.getMyData().then(function (me) {
    for(var i=ctrl.objTypes.length;i--; ) {
      ctrl.facIds[ctrl.objTypes[i]]=me.objCanAdmin[ctrl.objTypes[i]].join(',');
      if(ctrl.facIds[ctrl.objTypes[i]].length)ctrl.noIds=false;
    }
    $log.log('me.objCanAdmin',ctrl.facIds);
    ctrl.isLoading=0;
  });
  
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
