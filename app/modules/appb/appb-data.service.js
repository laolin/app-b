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
    userApiSign:userApiSign,
    userApiSignQueryStr:userApiSignQueryStr,
    urlApi:urlApi,
    urlSignApi:urlSignApi,
    requireLogin:requireLogin,

    dialogData:dialogData,
    setDialogData:AppbUiService.setDialogData,
    showDialog:AppbUiService.showDialog,
    hideDialog:AppbUiService.hideDialog,
    msgBox:msgBox,
    
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
  
  //快捷弹对话框函数
  function msgBox(content,title,b1,b2,f1,f2) {
    var d={
      content:content,
      title:title?title:'Msg',
      btn1:b1?b1:'OK',
      show:1
    };
    if('undefined' != typeof b2 ) {
      d.btn2=b2;
    }
    if('function' == typeof f1 ) {
      d.fn1=f1;
    }
    if('function' == typeof f2 ) {
      d.fn2=f2;
    }
    AppbUiService.setDialogData(d);
  }
  
  /**
   *  和api-call相关的 签名，和 Api-Core 服务器里的算法对应
   *  详见 appb-data-api
   *  
   *  返回签名需要的对象
   */
  function userApiSign(api,call) {
    var uid=appData.userData.uid;
    var tokenid=appData.userData.tokenid;
    var token=appData.userData.token;
    return AppbDataApi.userApiSign(uid,tokenid,token,api,call);
  }
  // 签名对象对应的 queryStr, 可以直接加 & 接在 URL 的后面
  function userApiSignQueryStr(api,call) {
    var dat=userApiSign(api,call);
    if(!dat)return '';
    var str = "";
    for (var key in dat) {
      if (str != "") {
          str += "&";
      }
      str += key + "=" + encodeURIComponent(dat[key]);
    }
    return str;
  }
  
  function urlApi(api,call,para1,para2) {
    var url = appData.appCfg.apiRoot+"/"+api+"/"+call;
    if('undefined' !== typeof para1) {
      url+='/'+para1;
      if('undefined' !== typeof para2) {
        url+='/'+para2;
      }
    }
    return url;
  } 
  // 需要验证身份的 api 对应的 url, 已带验证身份用的 queryStr
  function urlSignApi(api,call,para1,para2) {
    var dat=userApiSign(api,call);
    if(!dat)return '';
    var url = appData.appCfg.apiRoot+"/"+api+"/"+call;
    if('undefined' !== typeof para1) {
      url+='/'+para1;
      if('undefined' !== typeof para2) {
        url+='/'+para2;
      }
    }
    var str='';
    for (var key in dat) {
      if (str != "") {
          str += "&";
      }
      str += key + "=" + encodeURIComponent(dat[key]);
    }
    return url+'?'+str;
  }

  
  /**
   *  需要用户登录的页面
   */
  function requireLogin() {
    if(! userData || !userData.token) {
      var currPath=$location.path();
      $location.path( "/wx-login" ).search({pageTo: currPath});
      return false;
    }
    return true;
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
