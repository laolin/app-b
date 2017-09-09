'use strict';
(function(){

angular.module('steefac')
.factory('FacApi', ['$log','$timeout','$http','$q','AppbData',
function ($log,$timeout,$http,$q,AppbData){
  var appData=AppbData.getAppData();

  function createFac(data) {
    $log.log('FacApi.createFac',data);
    
    var deferred = $q.defer();
    
    var url=appData.urlSignApi('steefac','add');
    if(!url){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject(-1);
      return deferred.promise;
    }
    var d=(JSON.stringify(data));// 不需要encodeURIComponent？
    return $http.jsonp(url, {params:{d:d}})
    .then(function(s){
      if(s.data.errcode!=0) {
        $log.log('Er:getFeed:',s.data.msg);
        deferred.reject(-2);
        return deferred.promise;
      }


      deferred.resolve(s.data.data);
      return deferred.promise;
    },function(e){
      deferred.reject(e);
      return deferred.promise;
    });
    
    
    
    
    
  }
  
  return {
    createFac:createFac
  }
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
