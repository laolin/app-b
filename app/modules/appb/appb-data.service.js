'use strict';
(function(){
  
var KEY_CLIENTID=appbCfg.keyClientId;

angular.module('appb')
.factory('AppbData',
['$route','$rootScope','$location','$log','$timeout','$http','$window',
  'AppbConfig','AppbDataHeader','AppbDataFooter','AppbDataUser','AppbUiService','AppbDataApi',
function($route, $rootScope,$location,$log,$timeout,$http,$window,
  AppbConfig,AppbDataHeader,AppbDataFooter,AppbDataUser,AppbUiService,AppbDataApi) 
{
  
  var appCfg=AppbConfig();

  var headerData=AppbDataHeader.getHeaderData();
  var footerData=AppbDataFooter.getFooterData();
  var userData=AppbDataUser.getUserData();
  var dialogData=AppbUiService.getDialogData();

  var appData=this.appData={
    isWeixinBrowser:(/micromessenger/i).test(navigator.userAgent),
    clientId:'not-init-'+(+new Date()),
    
    
    headerData:headerData,
    footerData:footerData,
    userData:userData,
    setUserData:AppbDataUser.setUserData,
    api:AppbDataApi,

    dialogData:dialogData,
    setDialogData:AppbUiService.setDialogData,
    showDialog:AppbUiService.showDialog,
    hideDialog:AppbUiService.hideDialog,
    
    toastData:AppbUiService.getToastData(),
    toastHide:AppbUiService.toastHide,
    toastLoading:AppbUiService.toastLoading,
    toastDone:AppbUiService.toastDone,
    toastMsg:AppbUiService.toastMsg,
    
    appCfg:appCfg
  }
  init();

  window.appData=appData;//export to global

  //init functions
  function init() {
    initWx();
    initClientId();
  }

  function initWx() {
    //AppbUiService.toastLoading();
    AppbDataApi.getWjSign().then(function(r){
      var data=r.data.data;
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          // 所有要调用的 API 都要加到这个列表中'onMenuShareTimeline',
          /*
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'onVoicePlayEnd',
          'uploadVoice',
          'downloadVoice',
          */
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          /*
          'translateVoice',
          'getNetworkType',
          'openLocation',
          'getLocation',
          
          'hideOptionMenu',
          'showOptionMenu',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay'
          */
        ]
      });
      wx.ready(function () {
      // 在这里调用 API
      //================================
        //$log.log(' wx.ready - AppbUiService.toastHide before',appData.toastData);
        //AppbUiService.toastHide();
        //$log.log(' wx.ready - AppbUiService.toastHide after',appData.toastData);
      //===============================================
      }); 
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
  
  //factory functions
  
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
