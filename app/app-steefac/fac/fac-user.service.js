'use strict';
(function(){

var SYS_ADMIN=0x10000;

angular.module('steefac')
.factory('FacUser',
['$location','$log','AppbData','FacApi',
function($location,$log,AppbData,FacApi) {
  
  var FacUser={};
  var appData=AppbData.getAppData();
  if(! appData.userData || !appData.userData.token) {
    $location.path( "/wx-login" ).search({pageTo: '/search'});
    return {};
  }

  appData.FacUser=FacUser;

  var user={init:0,isAdmin:0,facMain:0,facCanAdmin:[]};

  //0 : not admin
  // > :普通
  // & 0x10000 : 超级管理员
  function isAdmin() {
    return FacUser.user.isAdmin;
  }
  function isSysAdmin() {
    return FacUser.user.isAdmin & SYS_ADMIN;
  }
  function canAdmin(fac) {
    return FacUser.user.facCanAdmin.indexOf(fac)>=0;
  }

  function init() {
    FacApi.callApi('stee_user','me').then(function(s){
      user.init=1;
      if(s) {
        user.isAdmin=parseInt(s.is_admin);
        user.facMain=parseInt(s.fac_main);
        user.facCanAdmin=s.fac_can_admin.split(',');
      }
    });;
    FacUser.user=user;
    FacUser.isAdmin=isAdmin;
    FacUser.isSysAdmin=isSysAdmin;
    FacUser.canAdmin=canAdmin;
  }
  init();
 
  return  FacUser;
  
}]);
 
  

})();