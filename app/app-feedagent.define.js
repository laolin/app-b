'use strict';
(function(){
  
//加个全局变量 appbCfg
var cfg=window.appbCfg={
  appName:"评论盒",
  
  appDesc:"欢迎使用评论盒",//微信分享时默认文本
  appLogo:"https://qinggaoshou.com/images/qgs-log-1.jpg",//微信分享时默认图片
  
  pageTitle:'评论盒',//默认的页面上方<ui-header>条的标题
  htmlTitle:'评论盒 - 请高手实用工具',//默认的浏览器的页面标题
  apiRoot: 'https://api.qinggaoshou.com/api-eb', //一般的API
  apiWxAuth: 'https://qinggaoshou.com/api-1.0', //WX 授权 callback 域名限制的URI

  //assetsRoot 的取值（__assetsPath）由 gulp 构建时自动替换
  assetsRoot: window.__assetsPath||'../assets',//可在本地部署静态文件 或 跨域部署静态文件

  version: 'feedagent.78.101.101.a'
};

cfg.modDep=[
  'feedagent'
];
cfg.defPath='/explore';

cfg.wxApp=[
    {name:'qgs-web',id:'wx8fb342a27567fee7'},
    {name:'qgs-mp',id:'wx93301b9f5ddf5c8f'}
  ];

cfg.keyClientId='FeedAgent_clientId';// 在AppbData里用
cfg.keyUserData='FeedAgent_userdata';// 在AppbDataUser里用

cfg.markWxLoginCallback='cb_xd';//和后端API的约定字符串，在 /wx-login里用

cfg.tabsAvailable=[
  ['index',[
    {text:'发布f',icon:'pencil-square-o',href:'/compose'},
    //{text:'错题',icon:'book',href:'/exbook'},
    {text:'浏览f',icon:'file-text-o',href:'/explore',active:1},
    //{text:'我的f',icon:'user',href:'/my'}
  ]],
  ['exbook-debug',[
    {text:'首页debug',icon:'home',href:'/compose',active:1},
    {text:'发现debug',icon:'search',href:'/explore'},
    {text:'我的debug',icon:'user',href:'/my'}
  ]]
];
cfg.headerAvailable=[
  ['explore',[
    {side:'right',link:'/compose',text:'发表评论'},
  ]],
  ['compose',[
    {side:'right',link:'/explore',text:'查看评论'},
  ]]
];


//___________________________________
})();
