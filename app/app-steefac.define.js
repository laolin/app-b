'use strict';
(function(){
  
window.__assetsPath='../assets';
//加个全局变量 appbCfg
var cfg=window.appbCfg={
  appName:"钢结构产能地图",
  
  appDesc:"精准产能，采购达人——全球钢构采购参谋。",//微信分享时默认文本
  appLogo:"https://qinggaoshou.com/images/qgs-log-cmoss.jpg",//微信分享时默认图片
  
  pageTitle:'钢结构产能地图',//默认的页面上方<ui-header>条的标题
  htmlTitle:'钢结构产能地图',//默认的浏览器的页面标题
  apiRoot: 'https://api.qinggaoshou.com/api-eb', //一般的API
  apiWxAuth: 'https://qinggaoshou.com/api-eb', //WX 授权 callback 域名限制的URI

  //assetsRoot 的取值（__assetsPath）由 gulp 构建时自动替换
  assetsRoot: window.__assetsPath,//可在本地部署静态文件 或 跨域部署静态文件

  version: 'steefac.78.101.101.a'
};

cfg.modDep=[
  'amap-main',
  'steefac'
];
cfg.defPath='/home';

cfg.wxApp=[
    {name:'qgs-web',id:'wx8fb342a27567fee7'},
    {name:'qgs-mp',id:'wx93301b9f5ddf5c8f'}
  ];

cfg.keyClientId='STEEFAC_clientId';// 在AppbData里用
cfg.keyUserData='STEEFAC_userdata';// 在AppbDataUser里用

cfg.markWxLoginCallback='cb_xd';//和后端API的约定字符串，在 /wx-login里用

cfg.tabsAvailable=[
  ['index',[
    {text:'首页',icon:'home',href:'/home',active:1,badge:0},
    {text:'产能地图',icon:'cubes',href:'/search',badge:0},
    {text:'我的',icon:'user',href:'/my'}
  ]],
  ['steefac-debug',[
    {text:'首页debug',icon:'home',href:'/compose',active:1},
    {text:'发现debug',icon:'search',href:'/explore'},
    {text:'我的debug',icon:'user',href:'/my'}
  ]]
];
cfg.headerAvailable=[
  ['home',[
    {side:'left',link:'-1',icon:'chevron-left'},
    {side:'right',link:'/compose',icon:'plus'},
    //{side:'right',link:'/settings',text:'换年级'}
  ]],
  ['back',[
    {side:'left',link:'/explore',icon:'home'},
    {side:'right',link:'/my',icon:'user'},
    //{side:'right',link:'/settings',text:'换年级'}
  ]]
];


//___________________________________
})();
