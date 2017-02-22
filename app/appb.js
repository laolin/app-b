'use strict';
(function(){
  
var cfg={
//-- start config data -----------
  apiRoot: 'https://api.qinggaoshou.com/api-1.0', //一般的API
  apiWxAuth: 'https://qinggaoshou.com/api-1.0', //WX 授权 callback 域名限制的URI

  wxApp:[
    {name:'qgs-web',id:'wx8fb342a27567fee7'},
    {name:'qgs-mp',id:'wx93301b9f5ddf5c8f'}
  ],
  version: '7.01'
};

cfg.keyClientId='APP-B_clientId';// 在AppbData里用
cfg.keyUserData='APP-B_userdata';// 在AppbDataUser里用

cfg.markWxLoginCallback='cb_xd';//和后端API的约定字符串，在 /wx-login里用


//-- end config data -----------
window.appbCfg=cfg;//加个全局变量

angular.module('appb-main',[
  'appb',
  'wx-login',

  'view-default',

  'ngResource',
  'ngRoute'
])
.config(['$sceDelegateProvider', function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    cfg.apiRoot+"/**",
    cfg.apiWxAuth+"/**",
    'self'
  ]);
}])
.factory('AppbConfig',[ '$log',
  function( $log) {
    this.config=cfg;    
    return function(){return cfg;}
  }
]);

//___________________________________
})();
