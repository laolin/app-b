'use strict';
(function(){
  
var FAC_ADMIN=0x1;
var SYS_ADMIN=0x10000;

angular.module('steefac')
.factory('FacUser',
['$location','$log','$q','AppbData','AppbAPI','AppbDataUser',
function($location,$log,$q,AppbData,AppbAPI,AppbDataUser) {
  
  var FacUser={};
  var appData=AppbData.getAppData();
  var dialogData=appData.dialogData;
  if(! appData.userData || !appData.userData.token) {
    $location.path( "/wx-login" ).search({pageTo: '/search'});
    return {};
  }

  appData.FacUser=FacUser;

  var myData={init:0,isAdmin:0,facMain:0,objCanAdmin:{}};
  FacUser.myData=myData;
  FacUser.admins=[];


  var objTypes=['steefac','steeproj'];

  //0 : not admin
  // > :普通
  // & 0x10000 : 超级管理员
  FacUser.isAdmin=function isAdmin() {
    return FacUser.myData.isAdmin;
  }
  FacUser.isSysAdmin=function isSysAdmin() {
    return FacUser.myData.isAdmin & SYS_ADMIN && 
      !FacUser.myData.disableSysAdmin ;
  }
  FacUser.canAdminObj=function canAdminObj(type,id) {
    return FacUser.myData.objCanAdmin[type].indexOf(''+id)>=0;
  }

  FacUser.getAdmins=function() {
    var deferred = $q.defer();
    if(FacUser.admins.length) {
      deferred.resolve(FacUser.admins);
      return deferred.promise;
    }
    return AppbAPI('stee_user','get_admins').then(function(s){
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
  
  
  
  FacUser.applyFacAdmin=function(fac) {
    return FacUser.applyAdmin('steefac',fac);
  }
  //申请管理一个厂
  FacUser.applyAdmin=function(type,fac) {
    
    dialogData.msgBox(
      '请您确认：您将负责管理维护【'+fac.name+
      '】的数据。',
      '管理员申请',
      '确认','取消',
      function(){
        return AppbAPI('stee_user','apply_admin',
          {type:type,facid:fac.id,userid:appData.userData.uid}
        ).then(function(s){//成功
          myData.init=0;
          appData.toastMsg('申请管理员成功',3);
          FacUser.getMyData();
          $location.path( "/my-fac" )
        },function(e){//失败
          dialogData.msgBox(e,'操作失败');
        });
      }
    );
  }

  FacUser.getMyData=function(reNew) {
    var deferred = $q.defer();
    if(!reNew && myData.init) {
      deferred.resolve(myData);
      return deferred.promise;
    }
    return AppbAPI('steesys','info').then(function(s){
      myData.init=1;
      if(s && s.me) {
        myData.isAdmin=parseInt(s.me.is_admin);
        myData.update_at=parseInt(s.me.update_at);
        myData.uid=parseInt(s.me.uid);
        myData.objCanAdmin={};
        for(var i=objTypes.length;i--; ) {
          myData.objCanAdmin[objTypes[i]]=s.me[objTypes[i]+'_can_admin'].split(',')
        }
        myData.counter={};
        myData.counter.nFac=s.nFac;
        myData.counter.nProj=s.nProj;
      } else { // 客户端的登录信息有误，要求重新登录。
        AppbDataUser.setUserData({});
        $location.path( "/wx-login" ).search({pageTo: currPath});
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