'use strict';
(function(){
  
var FAC_ADMIN=0x1;
var SYS_ADMIN=0x10000;

angular.module('steefac')
.factory('FacUser',
['$location','$log','$q','AppbData','FacApi',
function($location,$log,$q,AppbData,FacApi) {
  
  var FacUser={};
  var appData=AppbData.getAppData();
  var dialogData=appData.dialogData;
  if(! appData.userData || !appData.userData.token) {
    $location.path( "/wx-login" ).search({pageTo: '/search'});
    return {};
  }

  appData.FacUser=FacUser;

  var myData={init:0,isAdmin:0,facMain:0,facCanAdmin:[]};
  FacUser.myData=myData;
  FacUser.admins=[];

  //0 : not admin
  // > :普通
  // & 0x10000 : 超级管理员
  FacUser.isAdmin=function isAdmin() {
    return FacUser.myData.isAdmin;
  }
  FacUser.isSysAdmin=function isSysAdmin() {
    return FacUser.myData.isAdmin & SYS_ADMIN;
  }
  FacUser.canAdmin=function canAdmin(fac) {
    return FacUser.myData.facCanAdmin.indexOf(fac)>=0;
  }

  FacUser.getAdmins=function() {
    var deferred = $q.defer();
    if(FacUser.admins.length) {
      deferred.resolve(FacUser.admins);
      return deferred.promise;
    }
    return FacApi.callApi('stee_user','get_admins').then(function(s){
      $log.log('get_admins',s);
      if(!s) {
        deferred.reject('noData');
        return deferred.promise;
      }
      
      
      FacUser.admins=s;
      return appData.userData.requireUsersInfo(s).then(function(){
        deferred.resolve(FacUser.admins);
        return deferred.promise;
      });
    },function(e){
      deferred.reject(e);
      return deferred.promise;
    });
  }
  
  
  
  //申请管理一个厂
  FacUser.applyFacAdmin=function(fac) {
    
    dialogData.msgBox(
      '请您确认：您将负责管理维护【'+fac.name+
      '】的产能数据。',
      '成为钢构厂的管理员',
      '确认','取消',
      function(){
        return FacApi.callApi('stee_user','apply_fac_admin',
          {facid:fac.id,userid:appData.userData.uid}
        ).then(function(s){//成功
          myData.init=0;
          gFacUser.getMyData();
          $location.path( "/my-fac" )
        },function(e){//失败
          dialogData.msgBox(e,'操作失败');
        });
      }
    );
  }

  FacUser.getMyData=function() {
    var deferred = $q.defer();
    if(myData.init) {
      deferred.resolve(myData);
      return deferred.promise;
    }
    return FacApi.callApi('stee_user','me').then(function(s){
      myData.init=1;
      if(s) {
        myData.isAdmin=parseInt(s.is_admin);
        myData.facMain=parseInt(s.fac_main);
        myData.uid=parseInt(s.uid);
        myData.facCanAdmin=s.fac_can_admin.split(',');
      }
      deferred.resolve(myData);
      return deferred.promise;
    },function(e){
      deferred.reject(e);
      return deferred.promise;
    });
  }
  FacUser.getMyData();
 
  return  FacUser;
  
}]);
 
  

})();