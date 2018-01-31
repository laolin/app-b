'use strict';
(function(angular, window, undefined){

angular.module('appb')
.factory('AppbAPI', ['$log','$timeout','$http','$q','AppbData',
function ($log,$timeout,$http,$q,AppbData){
  var appData=AppbData.getAppData();

  function AppbAPI(api,call,params) {
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
  
  

  return  AppbAPI;
  
}]);


/**
 * 签名 API 工厂
 */
angular.module('appb')
.config(["$httpProvider", function($httpProvider){
  /**
   * 解决 post 问题
   */
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for(name in obj) {
      value = obj[name];
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
}])
.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}])

.factory('SIGN', ['$http', '$q', 'AppbData', function($http, $q, AppbData) {
  var appData = AppbData.getAppData();
  function jsonYes(json){
    return json && +json.errcode === 0;
  }

  /**
   * 用户 post 提交
   * 自动签名
   * 签名失败，跳转到登录页面
   */
  function post(api,call, data) {
    var url = appData.urlSignApi(api, call);
    if(!url){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      return $q.reject('needlogin:'+api+'.'+call);
    }
    return $http.post(appData.urlSignApi(api,call), data)
    .then( response => response.data )
    .then(json => {
      if(jsonYes(json)){
        return $q.when(json);
      }
      else{
        return $q.reject(json);
      }
    });
  }

  /**
   * 暴露函数
   */
  return {
    post : post
  };

}]);

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})(angular, window);
