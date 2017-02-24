'use strict';
(function(){
  
var KEY_CLIENTID=appbCfg.keyClientId;

angular.module('appb')
.factory('AppbData',
['$route','$rootScope','$location','$log','$timeout','$http','$window',
  'AppbConfig','AppbDataHeader','AppbDataFooter','AppbDataUser','AppbUiDialogService',
function($route, $rootScope,$location,$log,$timeout,$http,$window,
  AppbConfig,AppbDataHeader,AppbDataFooter,AppbDataUser,AppbUiDialogService) 
{
  
  var appCfg=AppbConfig();

  var headerData=AppbDataHeader.getHeaderData();
  var footerData=AppbDataFooter.getFooterData();
  var userData=AppbDataUser.getUserData();
  var dialogData=AppbUiDialogService.getData();

  var appData=this.appData={
    isWeixinBrowser:(/micromessenger/i).test(navigator.userAgent),
    clientId:'not-init-'+(+new Date()),
    
    
    headerData:headerData,
    footerData:footerData,
    userData:userData,
    setUserData:AppbDataUser.setUserData,

    dialogData:dialogData,
    setDialogData:AppbUiDialogService.setData,
    showDialog:AppbUiDialogService.show,
    hideDialog:AppbUiDialogService.hide,
    
    appCfg:appCfg
  }
  initClientId();

  window.appData=appData;//export to global

  
  
  //factory functions

  

  //
  function initClientId() {
    var saved_id= $window.localStorage.getItem(KEY_CLIENTID);
    if(saved_id) {
      return appData.clientId=saved_id;
    }
    var t1= +new Date();
    $timeout(function(){
      var t2= +new Date();
      appData.clientId='APP-B-'+md5('%@&*'+$location.host()+t1+t2+Math.random());
      $window.localStorage.setItem(KEY_CLIENTID,appData.clientId);
    },Math.random()*10);
    return false;
  }
  
  return {
    
    getHeaderData:AppbDataHeader.getHeaderData,
    setHeader:AppbDataHeader.setHeader,
    addHeader:AppbDataHeader.addHeader,
    activeHeader:AppbDataHeader.activeHeader,
    deleteHeader:AppbDataHeader.deleteHeader,

    
    getFooterData:AppbDataFooter.getFooterData,
    addFooter:AppbDataFooter.addFooter,
    activeFooter:AppbDataFooter.activeFooter,
    startPathMonitor:AppbDataFooter.startPathMonitor,
    
    getAppData:function(){return appData},
    getUserData:function(){return userData},
    
    getDialogData:function(){return dialogData},

  }
  
}]);
 
  
//___________________________________
})();
