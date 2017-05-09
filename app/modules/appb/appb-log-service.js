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
    var i;
    var deferred = $q.defer();

    var api=appData.urlSignApi('log','n');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject(-2);
      return deferred.promise;
    }
    logData.activityLoading=true;
    return $http.jsonp(api, {params:para})
    .then(function(s){
      if(s.data.errcode!=0) {
        $log.log('Er:getLog:',s.data.msg);
        appData.toastMsg('Er:getLog:'+s.data.msg+":"+s.data.errcode);
        //有错等几秒重试
        logData.activityLoading=false;
        return $timeout(function(){getLog_n(para)},8000);
      }
      
      logData.activityList=s.data.data;
      //获取所有 需要 的用户信息
      logData.activityLoading=false;
      return userData.requireUsersInfo(s.data.data);
      
    },function(e){
      // error
      $log.log('error at getLog_n',e);
      deferred.reject(e);
      logData.activityLoading=false;
      return deferred.promise;
    })
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
