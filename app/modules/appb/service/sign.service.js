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


  /** 签名后的数据类型 */
  function SingedRequest(url, post, result) {
    if (this instanceof SingedRequest) {
      this.url = url;
      this.post = post;
      this.result = result;
    }
    else return new SingedRequest(url, post, result);
  }
  serviceModule.run(['$q', function ($q) {
    SingedRequest.prototype = {
      reject: function (result) {
        this.result = $q.reject(result);
        return this;
      },
      when: function (result) {
        this.result = $q.when(result);
        return this;
      }
    }
  }]);


  /**
   * 签名供应商
   */
  serviceModule.provider('sign', [function () {

    /** url签名
     * 用户可以拦截本服务，以自定义签名，或附加参数
     * app.config(['signProvider', function(signProvider){
     *   signProvider.defaults.sign = function(api, call, SingedRequest){
     *     var your_url = "https:" + "//my.com/my_path/" + api + '/' + call + "?token=12345abc";
     *     var your_post = {sign: 'abcd2d3d'}; // 这是要附加的数据
     *     return new SingedRequest(your_url, your_post);
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
    function sign(api, call, SingedRequest) {
      return new SingedRequest(defaults.root + api + '/' + call, {});
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


    /** 请求前，进行预处理
     * 返回 signed 类型数据 ，将阻止后续处理，并自动抛出 stoped 拒绝
     * 返回一个承诺，将重置原承诺
     * 返回一个 !==false，将改写json为该值
     */
    function prePost(api, call, data) {
      var sign = $get();
      var signed = sign.sign(api, call, SingedRequest);
      angular.extend(signed.post, data);
      // 允许模拟 api 调用
      for (var i in sign.onpost) {
        var result = sign.onpost[i](api, call, data, signed.url, signed.post);
        if (result) {
          return signed.when(result);
        }
      }
      if (!signed.url) {
        return signed.reject('null require api.');
      }
      return signed;
    }
    function $get() {
      return {
        prePost: prePost,
        root: defaults.root || './',
        sign: defaults.sign || sign,
        jsonYes: defaults.jsonYes || jsonYes,
        before: defaults.before || before,
        onpost: defaults.onpost || []
      }
    };
    /**
     * 暴露函数，以兑现拦截
     */
    this.$get = $get;

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
      var signed = sign.prePost(api, call, data);
      if (signed.result) {
        return signed.result;
      }
      //alert(signed.url);
      return $http.post(signed.url, signed.post, { SIGNED: 'yes' })
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
      postLaolin: function(api, call, data){
        //alert(api + ' / ' + call)
        return post(api, call, data).then(json => json.data);
      },
      post
    }

  }]);

  /**
   * 签名拦截器
   *注册方法：
      app.config(["$httpProvider", function($httpProvider) {
        $httpProvider.interceptors.push("http2sign");
      }]);
   */
  serviceModule.factory('http2sign', ['$q', '$rootScope', 'sign', function ($q, $rootScope, sign) {
    return {
      request: function (config) {
        // 已签名过的，或不是post，不拦截
        if (config.method != "POST" || config.SIGNED) return config;
        var api_call = config.url.split('/');
        var signed = sign.prePost(api_call[0], api_call[1], config.data);
        if (signed.result) {
          return $q.when(signed.result);
        }
        //console.log('签名拦截器, 原url = ', config.url);
        //console.log('签名拦截器, 原数据 = ', config.data);
        config.data = signed.post;
        config.url = signed.url;
        //console.log('签名拦截器, config=', config);
        return config;
      },
      requestError: function (rejection) {
        // do something on request error
        console.log('签名拦截器, rejection=', rejection);
        return $q.reject(rejection)
      },
      response: function (response) {
        // 已签名过的，或不是post，不拦截
        if (response.config.method != "POST" || response.config.SIGNED) return response;
        return $q.when(response.data)
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
      },
      responseError: function (rejection) {
        // do something on response error
        console.log('签名拦截器, rejection=', rejection);
        return $q.reject(rejection);
      }
    };
  }]);
  /** */
})(angular, window);
