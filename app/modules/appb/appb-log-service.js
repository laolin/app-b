'use strict';
(function(){
  
angular.module('appb')
.factory('AppbLogService', 
['$log','$http','$timeout','$location','$q','AppbData','AppbDataUser',
function ($log,$http,$timeout,$location,$q,AppbData,AppbDataUser){
  var svc=this;
  var logData={};
  var appData=AppbData.getAppData();
  
  var userData=appData.userData;

  svc.logData=logData;


  /**
   *  para.hour=0~24: 
   *  para.day=0~30: 
   */
  function getLogActivity(para){
    return $http.post("log/n", para) //, {signType:'single'})
    .then( json => {
      logData.activityList = json.data;
      //获取所有 需要 的用户信息
      logData.activityLoading = false;
      return userData.requireUsersInfo(json.data);
    })
    .catch( json =>{
      if(json.errcode){
        return $timeout(function(){getLogActivity(para)},8000);
      }
      logData.activityLoading=false;
      return $q.reject(json);
    });
  }
  
  

  
  logData.getLogActivity=getLogActivity;
  
  logData.activityLoading=false;
  logData.activityList=[];
  appData.logData=logData;


  return {
    getLogData:function(){return logData;},
  }
         
}]);

//___________________________________
})();
