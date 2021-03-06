'use strict';
(function(){

// Declare app level module which depends on views, and components
angular.module('appb.main', [
    'appb',
    'dj-service',
    'wx-login',
    //'ngResource',
    'ngRoute'
  ].concat(appbCfg.modDep));

// Declare `appb` module, the common and core module
angular.module('appb', [
    
    //'ngResource',
    'angularMoment',
    'ngTouch',
    'ngRoute'
])
.config(['$sceDelegateProvider', '$locationProvider', '$routeProvider',
  function($sceDelegateProvider, $locationProvider, $routeProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      appbCfg.apiRoot+"/**",
      appbCfg.apiWxAuth+"/**",
      'https://res.wx.qq.com/**',
      'https://webapi.amap.com/**',
      
      'https://qinggaoshou.com/**',
      'https://api.qinggaoshou.com/**',
      'https://linjp.cn/**',
      'https://api.linjp.cn/**',
      
      'self'
    ]);
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: appbCfg.defPath});
  }
])
.factory('AppbConfig',[ '$log',
  function( $log) {
    this.config=appbCfg;    
    return function(){return appbCfg;}
  }
]);

//___________________________________
})();
