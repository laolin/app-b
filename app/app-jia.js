'use strict';
(function(){
  
//加个全局变量 appbCfg
var cfg=window.appbCfg={
  appName:"迦空间",
  
  appDesc:"迦空间，嘉空间，佳空间，家空间，加空间。",//微信分享时默认文本
  appLogo:"https://qinggaoshou.com/images/qgs-log-1.jpg",//微信分享时默认图片
  
  pageTitle:'迦空间',//默认的页面上方<ui-header>条的标题
  htmlTitle:'迦空间 - 嘉空间，佳空间，家空间，加空间',//默认的浏览器的页面标题
  apiRoot: 'https://api.qinggaoshou.com/api-eb', //一般的API
  apiWxAuth: 'https://qinggaoshou.com/api-1.0', //WX 授权 callback 域名限制的URI

  version: 'jia.78.101.101.a'
};

cfg.modDep=[
  'jia'
];
cfg.defPath='/explore';

cfg.wxApp=[
    {name:'qgs-web',id:'wx8fb342a27567fee7'},
    {name:'qgs-mp',id:'wx93301b9f5ddf5c8f'}
  ];

cfg.keyClientId='JIA_clientId';// 在AppbData里用
cfg.keyUserData='JIA_userdata';// 在AppbDataUser里用

cfg.markWxLoginCallback='cb_xd';//和后端API的约定字符串，在 /wx-login里用

cfg.tabsAvailable=[
  ['index',[
    {text:'迦空间',icon:'university',href:'/service'},
    {text:'一起迦',icon:'comments',href:'/explore',active:1},
    {text:'我的迦',icon:'user',href:'/my'}
  ]],
  ['jia-debug',[
    {text:'首页debug',icon:'home',href:'/compose',active:1},
    {text:'发现debug',icon:'search',href:'/explore'},
    {text:'我的debug',icon:'user',href:'/my'}
  ]]
];
cfg.headerAvailable=[
  ['jia-home',[
    {side:'left',link:'-1',icon:'chevron-left'},
    {side:'right',link:'/compose',icon:'plus'}
  ]],
  ['jia-back',[
    {side:'left',link:'/explore',icon:'home'},
    {side:'right',link:'/my',icon:'user'}
  ]]
];


//___________________________________
})();
