'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/log-analy-user-activity', {
templateUrl: 'app-steefac/stat/log-analy-user-activity.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','AppbLogService',
function ($scope,$http,$log,$location,
  AppbData,AppbLogService) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();
  appData.setPageTitle('用户活跃度');

  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  ctrl.userData=userData;
  ctrl.logData=appData.logData;

  var search=$location.search();
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
  var para={};
  if(day) {
    para.day=day;
  }
  if(hour) {
    para.hour=hour;
  }
  ctrl.day=day;
  ctrl.hour=hour;
  ctrl.isLoading=1;
  
  ctrl.logData.getLogActivity(para).then(function(s){
    ctrl.texts=[];
    ctrl.links=[];
    for( var i=0;i<ctrl.logData.activityList.length;i++) {
      ctrl.texts[i]='活跃度:'+ctrl.logData.activityList[i].n;
    }
    ctrl.isLoading=0;
    $log.log('OK-logData.getLogActivity',s);
  },function(e){
    ctrl.isLoading=0;
    $log.log('E-logData.getLogActivity',e);
  });



  
  //==================

  

  


  
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
