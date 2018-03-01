'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/send-msg', {
  pageTitle: "发送消息",
templateUrl: 'app-steefac/admin/send-msg.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','SIGN','FacUser',
function ($scope,$http,$log,$location,
  AppbData,SIGN,FacUser) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();
  //要求登录，如果未登录，会自动跳转到登录界面
  appData.requireLogin();
  
  $scope.FacUser=FacUser;
  $scope.isLoading=0;
  $scope.msg='Ready';
  
  $scope.startSend=function startSend() {
    $scope.isLoading=1;
    SIGN.postLaolin('steesys','send_todo_msg',{
      to_uid:36,
      title:'这是测试标题',
      content:'内容，本消息链接到搜索页面。',
      url:'/my-fac',
    }).then(function(s){
      $scope.isLoading=0;
    },function(e){
      $scope.isLoading=0;
      $scope.msg='错误'+e;
    });
  }
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
