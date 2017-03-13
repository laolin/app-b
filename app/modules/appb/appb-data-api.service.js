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
  function getWjSign() {
    
    //注， WjSign 目前用统一的qgs api, 不使用 Api-Core 代码系列中。
    var url=location.href.split('#')[0];
    return $http.jsonp(apiRoot+'/wx/jsapisign?app=qgs-mp&url='+encodeURIComponent(url));
  }
  
  /**
   *  和api-call相关的 签名，和 Api-Core 服务器里的算法对应
   *  
   *  返回值（ var dat ）
   *  提交时要带上 返回值dat 的以下项目值：
   *    uid
   *    tokenid
   *    timestamp (由本函数执行时的客户端时间生成，
   *      所以客户端的时间要是不准得太多的话API将验证出错)
   *    api_signature (本函数按服务器端一致的算法计算)
   *  
   *  注，不需要提交 token 值。
   */
  function userApiSign(uid,tokenid,token,api,call) {
    if(!uid || !tokenid || !token || !api) {
      return false;
    }
    if(!call ) {
      call='';
    }
    var dt=new Date()
    var tim=Math.round( (dt.getTime()/1000)) - 8*3600 - dt.getTimezoneOffset()*60;//修正为东8区

    var dat={};
    dat.uid=uid;
    dat.tokenid=tokenid;
    dat.timestamp=tim;
    $log.log('genApiSign of:',api+call+uid+token+tim);
    dat.api_signature=md5(api+call+uid+token+tim);
    return dat;
  }  
  
  return {
    userApiSign:userApiSign,
    getWjSign:getWjSign
  }
  
}]);
 
  
//___________________________________
})();
