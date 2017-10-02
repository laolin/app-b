'use strict';
(function(){

var SYS_ADMIN=0x10000;

angular.module('steefac')
.factory('FacUser',
['$location','$log','$q','AppbData','FacApi',
function($location,$log,$q,AppbData,FacApi) {
  
  var FacUser={};
  var appData=AppbData.getAppData();
  if(! appData.userData || !appData.userData.token) {
    $location.path( "/wx-login" ).search({pageTo: '/search'});
    return {};
  }

  appData.FacUser=FacUser;

  var user={init:0,isAdmin:0,facMain:0,facCanAdmin:[]};
  FacUser.user=user;
  FacUser.admins=[];

  //0 : not admin
  // > :普通
  // & 0x10000 : 超级管理员
  FacUser.isAdmin=function isAdmin() {
    return FacUser.user.isAdmin;
  }
  FacUser.isSysAdmin=function isSysAdmin() {
    return FacUser.user.isAdmin & SYS_ADMIN;
  }
  FacUser.canAdmin=function canAdmin(fac) {
    return FacUser.user.facCanAdmin.indexOf(fac)>=0;
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
      deferred.resolve(FacUser.admins);
      return deferred.promise;
    },function(e){
      deferred.reject(e);
      return deferred.promise;
    });
  }
  function init() {
    FacApi.callApi('stee_user','me').then(function(s){
      user.init=1;
      if(s) {
        user.isAdmin=parseInt(s.is_admin);
        user.facMain=parseInt(s.fac_main);
        user.facCanAdmin=s.fac_can_admin.split(',');
      }
    });
  }
  init();
 
  return  FacUser;
  
}]);
 
  

})();