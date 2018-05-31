!(function (angular, window, undefined) {

  var isWx = (/micromessenger/i).test(navigator.userAgent);
  var theConfigModule = angular.module('dj-http')

  /**
   * 请求登录, 验证登录
   */
  theConfigModule.run(['$state', 'sign', 'DjPop', function ($state, sign, DjPop) {
    sign.registerHttpHook({
      match: /^请求登录$/,
      hookRequest: function (config, mockResponse, match) {
        console.log('请求登录');
        var pageTo = $state.href(config.data.toState, config.data.toParams);
        $state.go("login", { mode: 'wx', pageTo });
        return mockResponse.reject();
      }
    });
    sign.registerHttpHook({
      match: /^验证登录$/,
      hookRequest: function (config, mockResponse, match) {
        console.log('验证登录, 如果当前登录票据不合法，就要跳转到登录界面');
        return mockResponse.reject();
      }
    });
  }]);


  /**
   * 延时缓存类
   */
  var CHttpCache = (function () {
    function CHttpCache($q, delay) {
      this.cacheDelay = delay || $q || 30;
      this.timestamp = 0;
      this.deferred = false;
      this.promise = false;
      if ($q && $q.defer && !CHttpCache.$q) {
        CHttpCache.$q = $q;
      }
    }
    CHttpCache.prototype = {
      resolve: function (promise) {
        CHttpCache.$q.when(promise).then(json => {
          this.deferred.resolve(this.promise = promise);
        }).catch(e => {
          this.deferred.reject(this.promise = e);
        });
      },
      getPromise: function () {
        var timestamp = Math.round(((new Date()).getTime() / 1000));
        if (this.deferred && timestamp - this.timestamp <= this.cacheDelay) {
          //console.log("有缓存");
          return this.promise = this.deferred.promise;
        }
        //console.log("没有缓存");
        this.deferred = CHttpCache.$q.defer();
        this.timestamp = timestamp;
        return false;
      },
    };
    return CHttpCache;
  })();

  /** 登录票据验证模块 */
  theConfigModule.run(['$http', '$q', 'sign', 'UserToken', function ($http, $q, sign, UserToken) {
    /**
     * 如果与服务器时间不同步，则重新请求一次以对时
     * 在 10 秒之内，不重复请求（不要求对时的除外）
     */
    var verifying = new CHttpCache($q, 10);
    sign.registerHttpHook({
      match: /^app\/verify_token$/,
      hookRequest: function (config, mockResponse, match) {
        var promise = verifying.getPromise();
        // 如果缓存有效，且不是刚刚对时
        if (promise && !config.afterAdjustTimestamp) {
          return mockResponse.resolve(
            $q.when(promise).then(json => json).catch(e => {
              return $http.post("app/verify_token", {}, { afterAdjustTimestamp: true });
            })
          );
        }
      },
      hookResponse: function (response) {
        var R = $q.when(response.data).then(json => {
          if (json && +json.errcode === 0) return json;
          // 不是刚刚对时
          if (!response.config.afterAdjustTimestamp && json.datas && json.datas.timestamp) {
            // 先对时一下
            var userToken = UserToken.reload()
            userToken.adjustTimestamp(json.datas.timestamp);
            // 重新请求一次，同时告诉本拦截器，不要再对时了
            return $http.post("app/verify_token", {}, { afterAdjustTimestamp: true });
          }
          return $q.reject(json);
        });
        // 让缓存兑现
        verifying.resolve(R);
        return R;
      }
    });
  }]);


  /** 用户模块 */
  theConfigModule.run(['$http', '$q', 'sign', function ($http, $q, sign) {


    function ajaxUserInfoRefresh() {
      if (ajaxUserInfoRefresh.result) return $q.when(ajaxUserInfoRefresh.result);
      var newUser = $http.post('user/info').then(json => {
        USER.me = json.datas.me;
      });
      var oldUser = $http.post('old-api/user/getfullinfo').then(json => {
        console.log("旧信息 json =", json);
        USER.userinfo = json.userinfo;
        if (window.API) {
          API.setuserinfo(USER.userinfo);
        }
      }).catch(e => {
        console.log("旧信息 e =", e);
      });
      return ajaxUserInfoRefresh.result = $q.all({ newUser, oldUser })
        .then((newUser, oldUser) => {
          ajaxUserInfoRefresh.result = false;
          return sign.OK({ me: USER.me, userinfo: USER.userinfo });
        });
    }
    function ajaxUserInfo() {
      if (ajaxUserInfo.result) return $q.when(ajaxUserInfo.result);
      if (USER.me && USER.me.uid) return sign.OK({ me: USER.me, userinfo: USER.userinfo });
      return ajaxUserInfo.result = USER["刷新个人信息"]().then(json => {
        ajaxUserInfo.result = json;
      });
    }


    var USER = {
      verify_token: function () {
        return $http.post("app/verify_token");
      },


      /** 个人信息部分 */
      me: {},

      "刷新个人信息": ajaxUserInfoRefresh,

      "个人信息": ajaxUserInfo,

      "保存个人信息": function (attr) {
        angular.extend(USER.me.attr || (USER.me.attr = {}), attr);
        return $http.post('user/save_info', { attr })
      },
      //---- 个人信息部分 end --------


      /** 微信数据部分 */
      wxCache: [],
      "微信数据": function (uids) {
        var uidIsArray = angular.isArray(uids);
        if (!uidIsArray) uids = [uids];

        var uidAllCache = USER.wxCache.map(row => row.uid);
        var uidInCache = uids.filter(uid => uidAllCache.indexOf(uid) >= 0);
        var uidNotCache = uids.filter(uid => uidAllCache.indexOf(uid) < 0);

        if (uidNotCache.length == 0) {
          return sign.OK(uidIsArray ?
            { list: USER.wxCache.filter(row => uids.indexOf(row.uid) >= 0) }
            : { wx: USER.wxCache.find(wx => wx.uid = uids[0]) }
          );
        }

        return $http.post('app/getWxInfo', { uid: uidNotCache }).then(json => {
          var list = json.datas.list;
          list.map(item => USER.wxCache.push(item));
          return sign.OK(uidIsArray ?
            { list: USER.wxCache.filter(row => uids.indexOf(row.uid) >= 0) }
            : { wx: USER.wxCache.find(wx => wx.uid = uids[0]) }
          );
        })
      },
      //---- 微信数据部分 end --------
    }


    /**
     * 用户模块
     */
    sign.registerHttpHook({
      match: /^用户(\/(.*))?$/,
      hookRequest: function (config, mockResponse, match) {
        return mockResponse.resolve(match[2] ?
          USER[match[2]](config.data) :
          USER[config.data]()
        );
      }
    });

  }]);


})(angular, window);
