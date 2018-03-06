'use strict';
(function(){
  
var KEY_CLIENTID=appbCfg.keyClientId;

// 只在微信浏览器中运行
// @var useWX: 是否应该使用微信 JSSDK
var useWX = location.origin.length > 12 && location.origin.indexOf('192.168') < 0 && navigator.userAgent.indexOf("MicroMessenger") > 0;


angular.module('appb')
.factory('AppbData',
['$q','$rootScope','$location','$log','$timeout','$http','$window',
  'AppbConfig','AppbDataHeader','AppbDataFooter','AppbDataUser','AppbUiService','AppbDataApi','moment','AppbErrorInfo',
function($q, $rootScope,$location,$log,$timeout,$http,$window,
  AppbConfig,AppbDataHeader,AppbDataFooter,AppbDataUser,AppbUiService,AppbDataApi,moment,AppbErrorInfo) 
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
  
  /**
   * 设置页面标题
   */
  function setTitle(title){
    document.title = title;
    if(navigator.userAgent.indexOf("MicroMessenger") > 0){
      // hack在微信等webview中无法修改document.title的情况
      var body = document.body,
        iframe = document.createElement('iframe');
      iframe.src = "/null.html";
      iframe.style.display = "none";
      iframe.onload = function(){
        setTimeout(function() {
          body.removeChild(iframe);
        }, 0);
      }
      body.appendChild(iframe);
    }
  }
  /**
   * 微信分享
   * @param options 可选的相关参数
   */
  function setWxShare(options){
    //微信分享
    var wxShareData={
      title: appbCfg.htmlTitle, // 分享标题
      desc : appbCfg.appDesc,
      link : location.href,
      imgUrl: appbCfg.appLogo, // 分享图标
      success: () => {},
      cancel: () =>{}
    }
    if(options){
      options.title  && (wxShareData.title  = options.title );
      options.desc   && (wxShareData.desc   = options.desc  );
      options.link   && (wxShareData.link   = options.link  );
      options.imgUrl && (wxShareData.imgUrl = options.imgUrl);
    }
    initWx().then( wx => {
      wx.onMenuShareAppMessage( wxShareData );
      wx.onMenuShareTimeline  ( wxShareData );
    })
    .catch( e =>{
      console.log('微信分享无效：', e);
    })
  }
  /**
   * 设置页面标题，同时，设置标题栏的标题
   * @param title 标题
   */
  function setPageTitle(title){
    setTitleAuto(title);
    AppbDataHeader.setPageTitle(title);
  }
  /**
   * 设置页面标题，同时，设置标题栏的标题
   * @param title 标题
   */
  function setPageTitleAndWxShareTitle(title){
    setTitleAuto(title)
    AppbDataHeader.setPageTitle(title);
    setWxShare({title});
  }
  /**
   * 设置页面标题, 根据是否显示标题栏，显示不同内容
   */
  function setTitleAuto(title){
    if(headerData.hide){
      setTitle(title + '-' + appbCfg.htmlTitle)
    }
    else{
      setTitle(appbCfg.htmlTitle);
    }
  }
  /**
   * 路由监听，设置标题，设置微信分享
   */
  $rootScope.$on('$routeChangeSuccess', function(evt, current, prev) {
    let title;
    let route = current.$$route;
    if(route.pageTitle){
      title = route.pageTitle + '-' + appbCfg.htmlTitle;
      setTitleAuto(route.pageTitle)
      AppbDataHeader.setPageTitle(route.pageTitle);
    }
    else{
      setTitle(title = appbCfg.htmlTitle)
    }

    //微信分享
    setWxShare(angular.extend({}, {title}, route.wxShare));
  });

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
  function requireLogin(str) {
    // 不再用此处代码跳转登录页面
    return true;
    if(angular.dj && angular.dj.userToken && angular.dj.userToken.data && angular.dj.userToken.data.token){
      userData.uid     = angular.dj.userToken.data.uid;
      userData.tokenid = angular.dj.userToken.data.tokenid;
      userData.token   = angular.dj.userToken.data.token;
    }
    if(! userData || !userData.token) {
      //alert(str + ',  userData=' + JSON.stringify(userData))
      var currPath=$location.path();
      if(currPath == '/wx-callback') return true;
      $location.path( "/login" ).search({pageTo: currPath});
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
  function goLink(a) {
    if(typeof a == 'function') {
      a();
      return false;
    }
    if(a && a.indexOf(':')>0){
      window.location=a;
    } else if(a) {
      $location.url(a);
    }
    return false;
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

    initWx().catch( e =>{
      console.log('微信分享无效：', e);
    })
    initClientId();
    //moment.changeLocale('zh-cn');
    moment.locale('zh-cn');
  }

  function initWx() {
    // 只在微信浏览器中运行
    if(!useWX) return $q.reject('not wx');
    if(initWx.promise){
      return $q.when(initWx.promise);
    }

    var deferred = $q.defer();

    AppbDataApi.getWjSign().then(function(r){
      var data=r.data.data;
      if(!data) {
        appData.msgBox('Err#'+r.data.errcode+':'+r.data.msg,'Error WxJsSign');
        deferred.reject('config error!');
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

      wx.ready(function () {
        deferred.resolve(initWx.promise = wx);
      });
    })
    .catch( e => {
      deferred.reject('getWjSign error!');
    });

    return initWx.promise = deferred.promise;
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
    
    setPageTitle: setPageTitle,
    setPageTitleAndWxShareTitle: setPageTitleAndWxShareTitle,
    showInfoPage:AppbErrorInfo.showInfoPage,
    
    headerData:headerData,
    footerData:footerData,
    userData:userData,
    setUserData:AppbDataUser.setUserData,
    dealWxHeadImg:AppbDataUser.dealWxHeadImg,
    
    api:AppbDataApi,
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

    goLink:goLink,
    wxShareData:wxShareData,//微信分享的显示信息
    appCfg:appCfg
  }
  init();

  window.appData=appData;//export to global

//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

  return {
    useWX: useWX,
    setWxShare: setWxShare,
    
    getHeaderData:AppbDataHeader.getHeaderData,
    setHeader:AppbDataHeader.setHeader,
    addHeader:AppbDataHeader.addHeader,
    hideHeader:AppbDataHeader.hideHeader,
    activeHeader:AppbDataHeader.activeHeader,
    deleteHeader:AppbDataHeader.deleteHeader,

    
    getFooterData:AppbDataFooter.getFooterData,
    addFooter:AppbDataFooter.addFooter,
    activeFooter:AppbDataFooter.activeFooter,
    startPathMonitor:AppbDataFooter.startPathMonitor,
    
    getAppData:function(){return appData},
    getUserData:function(){return AppbDataUser.getUserData();},
    
    getDialogData:function(){return dialogData},

  }
  
}]);
 
  
//___________________________________
})();
