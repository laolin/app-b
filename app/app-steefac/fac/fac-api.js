'use strict';
(function(){

angular.module('steefac')
.factory('FacApi', ['$log','$timeout','$http','$q','AppbData',
function ($log,$timeout,$http,$q,AppbData){
  var appData=AppbData.getAppData();

  function createFac(params) {
    return callApi('steefac','add',params);
  }
  function searchFac(params) {
    return callApi('steefac','search',params);
  }
  function callApi(api,call,params) {
    $log.log('FacApi.callApi ',api,call,params);
    
    var deferred = $q.defer();
    
    var url=appData.urlSignApi(api,call);
    if(!url){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject('needlogin:'+api+'.'+call);
      return deferred.promise;
    }

    return $http.jsonp(url, {params:params})
    .then(function(s){
      if(s.data.errcode!=0) {
        var err='Err:'+api+'.'+call+'('+s.data.msg+')';
        $log.log(err);
        deferred.reject(err);
        return deferred.promise;
      }


      deferred.resolve(s.data.data);
      return deferred.promise;
    },function(e){
      deferred.reject(e);
      return deferred.promise;
    });
    
  }//_api
  
  

  return {
    searchFac:searchFac,
    createFac:createFac,
    callApi:callApi
  }
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
