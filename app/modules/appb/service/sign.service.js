!(function (angular, window, undefined) {

  var serviceModule = angular.module('dj-service');

  /** 解决 post 问题 */
  serviceModule.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      for (name in obj) {
        value = obj[name];
        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if (value !== undefined && value !== null)
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
      return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
  }])
  serviceModule.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);

  /**
   * 签名供应商
   */
  serviceModule.provider('sign', [function () {

    /** url签名
     * 用户可以拦截本服务，以自定义签名，或附加参数
     * app.config(['signProvider', function(signProvider){
     *   signProvider.defaults.sign = function(api, call){
     *     var your_url = "https:" + "//my.com/my_path/" + api + '/' + call + "?token=12345abc";
     *     var your_post = {sign: 'abcd2d3d'};
     *     return {
     *       url: your_url,
     *       post: your_post
     *     };
     *   }
     *   // jsonYes()、root 等，同上
     * }])
     */
    var defaults = this.defaults = {
      root: './',
      sign: sign,
      jsonYes: jsonYes,
      before: before,
      onpost: []
    };

    /** url签名
     */
    function sign(api, call) {
      return {
        url: defaults.root + api + '/' + call,
        post: {}
      }
    }

    /** 判断后端返回是否正确
     */
    function jsonYes(json) {
      return json && +json.errcode === 0;
    }

    /** 后端返回后，进行预处理
     * 返回 ===false ，将阻止后续处理，并自动抛出 stoped 拒绝
     * 返回一个承诺，将重置原承诺
     * 返回一个 !==false，将改写json为该值
     */
    function before(json) {
      return json;
      if (json.errcode === -1) {
        // 跳转到登录页面
        // 阻止后续操作
        return false;
      }
    }

    /** post 拦截器
     * 允许多次拦截，逐个执行
     * 当返有一个回承诺，将该承诺作为模拟 api 的调用结果
     * 当有一个返回 !==false，直接作为模拟 api 调用的承诺结果
     */
    var onpost = [
      function (api, call, data, signedUrl, postData) { }
    ];


    /**
     * 暴露函数，以兑现拦截
     */
    this.$get = function () {
      return {
        root: defaults.root || './',
        sign: defaults.sign || sign,
        jsonYes: defaults.jsonYes || jsonYes,
        before: defaults.before || before,
        onpost: defaults.onpost || []
      }
    };

  }]);

  /**
   * 签名供应商
   */
  serviceModule.factory('SIGN', ['$q', '$http', 'sign', function ($q, $http, sign) {
    /**
     * 用户 post 提交
     * 自动签名
     * 签名失败，跳转到登录页面
     */
    function post(api, call, data) {
      console.log('用户 post 提交', api, call, data);
      var signed = sign.sign(api, call);
      var postData = angular.extend({}, signed.post, data);
      // 允许模拟 api 调用
      for (var i in sign.onpost) {
        var result = sign.onpost[i](api, call, data, signed.url, postData);
        if (result) {
          return $q.when(result);
        }
      }
      return $http.post(signed.url, postData)
        .then(response => response.data)
        .then(json => {
          var result = sign.before(json);
          if (result === false) {
            return $q.reject('stoped');
          }
          return $q.when(result);
        })
        .then(json => {
          if (sign.jsonYes(json)) {
            return $q.when(json);
          }
          else {
            return $q.reject(json);
          }
        });
    }

    return {
      post
    }

  }]);
  /** */
})(angular, window);
