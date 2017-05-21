'use strict';
(function(){
  
var KEY_CLIENTID=appbCfg.keyClientId;

angular.module('appb')
.factory('AppbData',
['$route','$rootScope','$location','$log','$timeout','$http','$window',
  'AppbConfig','AppbDataHeader','AppbDataFooter','AppbDataUser','AppbUiService','AppbDataApi','moment',
function($route, $rootScope,$location,$log,$timeout,$http,$window,
  AppbConfig,AppbDataHeader,AppbDataFooter,AppbDataUser,AppbUiService,AppbDataApi,moment) 
{
  
  var appCfg=AppbConfig();

  var headerData=AppbDataHeader.getHeaderData();
  var footerData=AppbDataFooter.getFooterData();
  var userData=AppbDataUser.getUserData();
  var dialogData=AppbUiService.getDialogData();

  var lastError={count:0,time:+new Date(),msg:''};

  var wxShareData ={//微信分享的显示信息
  };
  //---------------------------------------------
  // BEGIN: factory functions
  //---------------------------------------------
  
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
    


  /**
   *  计算出错次数，避免网络不好出错后继续频繁刷新
   *  
   *  n : true值  => 加一次出错
   *  n : false值 => 直接返回出错次数
   *  记录上次出错时间，每秒出错次数 -1
   */
  function errorCount(n,msg) {
    var now=+new Date();
    var last=lastError.time;
    //每秒出错次数 -1
    lastError.count -= (now-last)/1000;//js不是整数也可以 ++  不用Math.floor
    lastError.count = Math.max(0,lastError.count);
    if(n) {
      lastError.count++;
      lastError.time = now;
      if(msg)lastError.msg=msg;
    }
    
    return lastError.count;
  }
  function errorMsg() {
    return lastError.msg;
  }
  //---------------------------------------------
  // END: factory functions
  //---------------------------------------------

  //---------------------------------------------
  // BEGIN: init functions
  //---------------------------------------------
  function init() {
    $http.jsonp(urlApi('file','path')).then(function(d){
      if(d.data.errcode==0) {
        appData.filePath=appData.appCfg.apiRoot+d.data.data;
      }
    });

    initWx();
    initClientId();
    //moment.changeLocale('zh-cn');
    moment.locale('zh-cn');
  }

  function initWx() {
    AppbDataApi.getWjSign().then(function(r){
      var data=r.data.data;
      if(!data) {
        appData.msgBox('Err#'+r.data.errcode+':'+r.data.msg,'Error WxJsSign');
        return;
      }
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          // 所有要调用的 API 都要加到这个列表中
          'onMenuShareTimeline',
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
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
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
        ]
      });
      wxShareData.title= headerData.bTitle, // 分享标题
      wxShareData.desc= appCfg.appDesc,
      wxShareData.link= location.href;
      wxShareData.imgUrl= appCfg.appLogo, // 分享图标
      wxShareData.success= function () { 
      },
      wxShareData.cancel= function () { 
      }
      wx.ready(function () {
        // 在这里调用 API
        //================================
        

        wx.onMenuShareAppMessage( wxShareData ); 
        wx.onMenuShareTimeline( wxShareData ); 
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
  

  //---------------------------------------------
  // END: init functions
  //---------------------------------------------

  //---------------------------------------------
  // Run init functions:
  //---------------------------------------------

  var appData=this.appData={
    isWeixinBrowser:(/micromessenger/i).test(navigator.userAgent),
    clientId:'not-init-'+(+new Date()),
    
    /**
     *  appData.filePath
     *  用于直接通过URL访问API上传的文件
     *  （通常是通过API /file/g 访问文件 ）
     */
    filePath: '',// see: init()
    errorCount:errorCount,
    errorMsg:errorMsg,
    
    headerData:headerData,
    footerData:footerData,
    userData:userData,
    setUserData:AppbDataUser.setUserData,
    dealWxHeadImg:AppbDataUser.dealWxHeadImg,
    
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
    
    galleryData:AppbUiService.getGalleryData(),
    showGallery:AppbUiService.showGallery,
    
    inputData:AppbUiService.getInputData(),
    menuData:AppbUiService.getMenuData(),

    wxShareData:wxShareData,//微信分享的显示信息
    appCfg:appCfg
  }
  init();

  window.appData=appData;//export to global

//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

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
