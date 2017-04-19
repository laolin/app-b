'use strict';
(function(){
  
//加个全局变量 appbCfg
var cfg=window.appbCfg={
  appName:"错题整理工具",
  
  appDesc:"欢迎使用错题整理工具",//微信分享时默认文本
  appLogo:"https://api.qinggaoshou.com/api-1.0/uploads/wx_1f5d16338807332c9f6d6dd3cae69b4ca20935b0.jpg",//微信分享时默认图片
  
  pageTitle:'错题整理',//默认的页面上方<ui-header>条的标题
  htmlTitle:'错题整理 - 请高手实用工具系列',//默认的浏览器的页面标题
  apiRoot: 'https://api.qinggaoshou.com/api-1.0', //一般的API
  apiWxAuth: 'https://qinggaoshou.com/api-1.0', //WX 授权 callback 域名限制的URI

  version: 'exbook.78.101.100.a'
};

cfg.modDep=[
  'exbook'
];
cfg.defPath='/';

cfg.wxApp=[
    {name:'qgs-web',id:'wx8fb342a27567fee7'},
    {name:'qgs-mp',id:'wx93301b9f5ddf5c8f'}
  ];

cfg.keyClientId='EXBOOK_clientId';// 在AppbData里用
cfg.keyUserData='EXBOOK_userdata';// 在AppbDataUser里用

cfg.markWxLoginCallback='cb_xd';//和后端API的约定字符串，在 /wx-login里用

cfg.tabsAvailable=[
  ['exbook-index',[
    {text:'首页',icon:'home',href:'/',active:1},
    //{text:'错题',icon:'book',href:'/exbook'},
    {text:'发现',icon:'search',href:'/explore'},
    {text:'我的',icon:'user',href:'/my'}
  ]],
  ['exbook-debug',[
    {text:'首页debug',icon:'home',href:'/',active:1},
    {text:'发现debug',icon:'search',href:'/explore'},
    {text:'我的debug',icon:'user',href:'/my'}
  ]]
];
cfg.headerAvailable=[
  ['exbook-home',[
    {side:'left',link:'-1',icon:'chevron-left'},
    {side:'right',link:'/',icon:'plus'},
    //{side:'right',link:'/settings',text:'换年级'}
  ]],
  ['exbook-back',[
    {side:'left',link:'1',icon:'home'},
    {side:'right',link:'/my',icon:'user'},
    //{side:'right',link:'/settings',text:'换年级'}
  ]]
];


//___________________________________
})();
