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
  version: '7.00'
//-- end config data -----------
};

angular.module('appb')
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
