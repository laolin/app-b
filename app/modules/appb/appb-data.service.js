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
  function activeTabByPath(p) {
    $log.log('activeTabByPath',p);
    for(var i=footerData.tabs.length;i--; ){
      if(footerData.tabs[i].href==p)break;
    }
    if(i<0)return true;
    return activeTabByIndex(i);
  }

  function activeTabByIndex(nt) {
    $log.log('activeTabByIndex',nt);
    for(var i=footerData.tabs.length;i--; ){
      footerData.tabs[i].active=false;
    }
    footerData.tabs[nt].active=true;
    headerData.type=footerData.tabs[nt].hdType;
    if(typeof(footerData.tabs[nt].onClick)=='function')footerData.tabs[nt].onClick();
    return true;
  }
  
  function startPathMonitor() {
    $rootScope.$on('$routeChangeSuccess', function() {
      
      //if(! userData || !userData.token) {
      //  $location.path( "/wx-login" );
      //} else {
        activeTabByPath($location.path());
      //}
    });
  }
  

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
    
    getHeaderData:function(){return headerData},
    getFooterData:function(){return footerData},
    getAppData:function(){return appData},
    getUserData:function(){return userData},
    
    getDialogData:function(){return dialogData},

    activeTabByPath:activeTabByPath,
    activeTabByIndex:activeTabByIndex,
    startPathMonitor:startPathMonitor
  }
  
}]);
 
  
//___________________________________
})();
