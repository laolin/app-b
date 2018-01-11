'use strict';
(function(){
  
var FAC_ADMIN=0x1;
var SYS_ADMIN=0x10000;




angular.module('steefac')
.factory('FacUser',
['$location','$log','$q','$timeout','AppbData','AppbAPI','AppbDataUser',
function($location,$log,$q,$timeout,AppbData,AppbAPI,AppbDataUser) {
  
  var FacUser={};
  var appData=AppbData.getAppData();
  var dialogData=appData.dialogData;
  
  appData.headerData.hide=true;//说不要页面顶部的标题栏了
  
  appData.requireLogin();

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
    return FacUser.myData.objCanAdmin[type] && FacUser.myData.objCanAdmin[type].indexOf(''+id)>=0;
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
  

  FacUser.getRights=function(userid) {
    var deferred = $q.defer();
    return AppbAPI('stee_user','get_user_rights',{userid:userid}).then(function(s){
      $log.log('get_user_rights',s);
      if(!s) {
        deferred.reject('noData');
        return deferred.promise;
      }
      deferred.resolve(s.data);
      return deferred.promise;
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


  /**
   * 申请用户数据，返回一个承诺
   * @param reNew: 是否强制要求更新
   * 开始申请时, FacUser.getMyData.result 被置为一个承诺，发出请求后，立即返回该承诺
   *   下次再执行本函数时，若正在请求，将立即返回它
   * 请求成功后，请求结果保存到 FacUser.getMyData.result，
   *   下次再执行本函数时，若不是强制要求强制更新，将立即返回它(作为承诺的结果)
   * 请求失败，则将 FacUser.getMyData.result 置为 false, 下次将再次发起请求
   * 本函数可以多次调用，不用考虑是否正在请求
   */
  FacUser.getMyData=function(reNew) {
    if(!reNew && FacUser.getMyData.result){
      // 不管 FacUser.getMyData.result 现在是承诺或实际数据，作为承诺的数据，返回
      return $q.when(FacUser.getMyData.result);
    }
    var deferred = $q.defer();
    AppbAPI('steesys','info').then(function(s){
      myData.init=1;
      if(!s) { // 客户端的登录信息有误，要求重新登录。
        AppbDataUser.setUserData({});
        $location.path( "/wx-login" ).search({pageTo: '/'});
        // 错误了，就要重置一下，并告诉承诺不能兑现的原因
        FacUser.getMyData.result = false;
        return $q.reject("客户端的登录信息有误，要求重新登录。");
      }
      myData.counter={};
      myData.counter.nFac=s.nFac;
      myData.counter.nProj=s.nProj;
      if(s.wx && s.wx.openid) {
        AppbDataUser.dealWxHeadImg(s.wx);
        myData.wx=s.wx;
        angular.extend(appData.userData.wxinfo,s.wx)
        AppbDataUser.saveUserDataToLocalStorage();
      }
      if(s.me && s.me.uid) {
        myData.isAdmin=parseInt(s.me.is_admin);
        myData.update_at=parseInt(s.me.update_at);
        myData.uid=parseInt(s.me.uid);
        myData.objCanAdmin={};
        for(var i=objTypes.length;i--; ) {
          myData.objCanAdmin[objTypes[i]]=s.me[objTypes[i]+'_can_admin'].split(',')
        }
      }
      // 请求成功，将 FacUser.getMyData.result 原为承诺，改为实际数据，
      deferred.resolve(FacUser.getMyData.result = myData);
    },function(e){
      // 请求失败，以后要数据时，将再次调用 AppbAPI
      FacUser.getMyData.result = false;
      deferred.reject(e);
    });
    // 发出请求后，保存并立即返回该承诺
    return FacUser.getMyData.result = deferred.promise;
  }
  FacUser.getMyData();
 
  return  FacUser;
  
}]);
 
  

})();