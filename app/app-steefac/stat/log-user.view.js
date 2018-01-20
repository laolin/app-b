'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/log-user', {
  pageTitle: "用户活跃度",
templateUrl: 'app-steefac/stat/log-user.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','AppbAPI', 'FacUser',
function ($scope,$http,$log,$location,
  AppbData,AppbAPI,FacUser) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();

  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  ctrl.userData=userData;

  var search=$location.search();
  var userid=parseInt(search.uid);
  var day=parseInt(search.day);
  var hour=parseInt(search.hour);
  if(isNaN(day))day=0;
  if(isNaN(hour))hour=0;
  day=Math.max(0,day);
  day=Math.min(365,day);
  hour=Math.max(0,hour);
  hour=Math.min(24,hour);
  if(hour==0 && day==0) {
    hour=2;
  }
  ctrl.userid=userid;
  ctrl.day=day;
  ctrl.hour=hour;
  ctrl.isLoading=1;
  ctrl.logs=[];
  
  userData.requireUsersInfo([{uid:userid}]);
  menuUserLogs(userid,day,hour);
  
  function menuUserLogs(userid,day,hour) {
    return AppbAPI('log','user',{userid:userid,day:day,hour:hour}).then(function(s){
      ctrl.isLoading=0;
      $log.log('menuUserLogs',s);
      if(!s) {
        $log.log('Err 1',s);
        return;
      }
      getLogsCell(s);
    },function(e){
      ctrl.isLoading=0;
    });
  }
  function getLogsCell(d){
    ctrl.logs=[];
    var i;
    for(i=0;i<d.length;i++) {
      ctrl.logs[i]={
        icon:'clock-o',
        text:(i+1)+'@'+d[i].time+'@'+d[i].host+' '+d[i].api,
        url:function(_t){return function(){appData.msgBox(_t,'详细参数')}}(d[i].get)};//+' '+
    }
  }


  
  //==================

  

  


  
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
