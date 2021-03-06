'use strict';
(function(){
  
var defTitle=appbCfg.pageTitle;
var defBTitle=appbCfg.htmlTitle;

angular.module('appb')
.factory('AppbDataHeader',
['$route','$rootScope','$location','$log','AppbConfig',
function($route, $rootScope,$location,$log,AppbConfig) {
  var appCfg=AppbConfig();

  var headerData={};
  this.headerData=headerData;

  // headerData
  // 链接默认都是app内部链接
  // '-1' 代表后退
  // 通过设定absUrl=1，可以跳到外部链接
  //
  // 默认的几种header样式：
  var headerAvailable=this.dataAvailable={
    '1':[ //link to root
      {side:'left',link:'/',icon:'chevron-left'}
    ],
    '-1':[ //go back
      {side:'left',link:'-1',icon:'chevron-left'}
    ]
  };
  var cfg=AppbConfig();
  if(cfg.headerAvailable) {
    var cfgt=cfg.headerAvailable;
    for(var i=cfgt.length; i--; ) {
      addHeader(cfgt[i][0],cfgt[i][1]);
    }
  }

  activeHeader('1');
  
  //TODO: 验证 widgets 的有效性
  function addHeader(name,widgets) {
    headerAvailable[name]=widgets;
  }
  
  //使用指定name的header，也可同时指定 title
  //如果不指定 title, 就用 header[name].title
  function hideHeader() {
    headerData.hide=true;
  }
  
  
  function initWxShareData() {
    return;
    var wxShareData={};
    wxShareData.title= headerData.bTitle, // 分享标题
    wxShareData.desc= appCfg.appDesc,
    wxShareData.link= location.href;
    wxShareData.imgUrl= appCfg.appLogo, // 分享图标
    wxShareData.success= function () { 
    },
    wxShareData.cancel= function () { 
    }

    // 只在微信浏览器中运行
    var useWX = location.origin.length > 12 && location.origin.indexOf('192.168') < 0 && navigator.userAgent.indexOf("MicroMessenger") > 0;
    if(!useWX) return;

    wx.ready(function () {
      wx.onMenuShareAppMessage( wxShareData ); 
      wx.onMenuShareTimeline( wxShareData ); 
    }); 
  }

  
  
  function setPageTitle(title) {
    headerData.title=title || defTitle; //页面内上方的标题
    if(headerData.hide)
      headerData.bTitle= title +'-'+ defBTitle; //更改浏览器的标题
    else 
      headerData.bTitle= defBTitle;// 固定浏览器的标题
    //$rootScope.pageTitle=headerData.bTitle;
    initWxShareData();
  }
  function activeHeader(name,title,bTitle) {
    if(!headerAvailable[name]) {
      name='1';//不存在时，用默认的
    }
    //headerData.hide=false;
    headerData.title=title || defTitle;
    //headerData.bTitle=bTitle?bTitle:title +'-'+ defBTitle;
    headerData.bTitle=bTitle?bTitle:defBTitle;
    headerData.name=name;
    headerData.widgets=headerAvailable[name];

    //$rootScope.pageTitle=headerData.bTitle;
    initWxShareData();
  }
  function deleteHeader(name) {
    return delete headerAvailable[name];
  }
  //title 页面内上方的标题
  //bTitle 浏览器的标题
  //left 左侧链接 0=home, -1=back
  //right 右侧链接
  function setHeader(title,bTitle,left,right) {
    var auto_name ='__auto_name_%@&*-LONG-LONG';
    var w=[];
    if(left==1)w[0]=headerAvailable['1'][0];// link to home
    else if(left==-1) w[0]=headerAvailable['-1'][0];//go back link
    if(right)w=w.concat(right);
    delete headerAvailable[auto_name];
    headerAvailable[auto_name]=w;
    activeHeader(auto_name,title,bTitle);
  }
  return {    
    addHeader:addHeader,
    hideHeader:hideHeader,
    activeHeader:activeHeader,
    setPageTitle:setPageTitle,
    deleteHeader:deleteHeader,
    
    setHeader:setHeader,
    
    getHeaderData:function(){return headerData}
  }
  
}]);
 
  
//___________________________________
})();
