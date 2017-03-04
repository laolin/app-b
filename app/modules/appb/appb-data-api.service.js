'use strict';
(function(){

angular.module('appb')
.factory('AppbDataApi',
['$http','$log','AppbConfig',
function($http,$log,AppbConfig) {

  var cfg=AppbConfig();
  var apiRoot=cfg.apiRoot;
  

  
  /**
   *  返回 微信 JSAPI 的签名
   */
  function getWjSign(onSuccess,onError) {
    
    //注， WjSign 目前用统一的qgs api, 不使用 Api-Core 代码系列中。
    var url=location.href.split('#')[0];
    return $http.jsonp(apiRoot+'/wjsign?app=qgs-mp&url='+encodeURIComponent(url));
  }
  
  
  return {
    getWjSign:getWjSign
  }
  
}]);
 
  
//___________________________________
})();
