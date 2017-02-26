'use strict';
(function(){
  
var cfg={
  appName:"Laolin's app B",
  pageTitle:'Welcome',//默认的页面上方<ui-header>条的标题
  htmlTitle:'App-B',//默认的浏览器的页面标题
  apiRoot: 'https://api.qinggaoshou.com/api-1.0', //一般的API
  apiWxAuth: 'https://qinggaoshou.com/api-1.0', //WX 授权 callback 域名限制的URI

  version: '78.101.100.a'
};

//和 index.html 里的 ng-app 要一致
cfg.modName='app-b';
cfg.modDep=[
  'view-default',
  'view-test'
];
cfg.defPath='/default-settings';

cfg.wxApp=[
    {name:'qgs-web',id:'wx8fb342a27567fee7'},
    {name:'qgs-mp',id:'wx93301b9f5ddf5c8f'}
  ];

cfg.keyClientId='APP-B_clientId';// 在AppbData里用
cfg.keyUserData='APP-B_userdata';// 在AppbDataUser里用

cfg.markWxLoginCallback='cb_xd';//和后端API的约定字符串，在 /wx-login里用

cfg.tabsAvilable=[
  ["0", [
      {text:'首页',icon:'home',href:'/',onClick:0,active:0},
      {text:'搜索',icon:'search',href:'/default-search',onClick:0,active:1},
      {text:'测试',icon:'cog',href:'/default-settings',onClick:0,active:0}
  ]],
  ["test", [
      {text:'TEST1',icon:'car',href:'/test-1',onClick:0,active:0},
      {text:'test2',icon:'bell',href:'/test-2',onClick:0,active:2},
      {text:'test-3',icon:'bicycle',href:'/test-3',onClick:0,active:0}
  ]]
];


window.appbCfg=cfg;//加个全局变量


//___________________________________
})();
