!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config', ['app-site-config', 'dj-login'])


  theConfigModule.factory("SIGN", ["$http", function ($http) {
    return {
      post: function (api, call, data, config) {
        return $http.post(api + '/' + call, data, config);
      },
      postLaolin: function (api, call, data) {
        //console.log("postLaolin", api + '/' + call)
        return $http.post(api + '/' + call, data).then(json => json.data);
      },
    };
  }]);

  theConfigModule.run(['$rootScope', '$http', '$q', 'sign', 'SiteConfig', 'UserToken', function ($rootScope, $http, $q, sign, SiteConfig, UserToken) {
    sign.setApiRoot(SiteConfig.apiRoot);
    sign.registerDefaultRequestHook((config, mockResponse) => {
      return {
        url: SiteConfig.apiRoot + config.url + "?" + UserToken.reload().signParamString(),
        post: config.data
      }
    });

    /**
     * 仅仅签名
     */
    sign.registerHttpHook({
      match: /^签名$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        var url = param.url || param || "";
        var data = param.data || {};
        return mockResponse.resolve(sign.OK({
          url: SiteConfig.apiRoot + url + "?" + UserToken.reload().signParamString(),
          data: data
        }));
      }
    });
  }]);


  /** 用户模块 */
  theConfigModule.run(['$rootScope', '$http', '$q', '$timeout', 'sign', 'DjWaiteReady', confogUser]);

  function confogUser($rootScope, $http, $q, $timeout, sign, DjWaiteReady) {
    const SYS_ADMIN=0x10000;

    /**
     * 所有用户权限
     */
    var theRights = [
      { name: "推送项目给产能", fa: "send", path: "", color: "#f80" },
      { name: "推送产能给项目", fa: "send", path: "", color: "#808" },
      { name: "更新项目", fa: "edit", path: "", color: "#080" },
      { name: "更新产能", fa: "edit", path: "", color: "#666" },
      { name: "关闭项目", fa: "edit", path: "", color: "#666" },
      { name: "工作人员", fa: "user-circle-o", path: "", color: "#f80" },

      { admin: 1, name: "用户管理", fa: "users", path: "/roleright/list", color: "#080" },
    ]

    var USER = {
      getMenu: function () {
        return $http.post("app/verify_token").then(json => {
          return sign.OK(json.datas, {
            menu: userMenu
          });
        }).catch(e => {
          return sign.error(-1, '登录失败', {
            e,
            menu: userMenu
          });
        })
      },

      "权限分组": function (rights) {
        if (rights.indexOf("超级管理员") >= 0) {
          return {
            rightFull: theRights,
            rightIcons: theRights,
            rightUserIcons: theRights.filter(item => !item.admin),
            rightAdminIcons: theRights.filter(item => item.admin)
          }
        }
        return {
          rightFull: theRights,
          rightIcons: theRights.filter(item => rights.indexOf(item.name) >= 0),
          rightUserIcons: theRights.filter(item => !item.admin && rights.indexOf(item.name) >= 0),
          rightAdminIcons: theRights.filter(item => item.admin && rights.indexOf(item.name) >= 0)
        }
      },


      /** 个人信息部分 */
      me: {},
      wait_app_me: false, //new DjWaiteReady(),
      "刷新个人信息": function () {
        if (USER.me.uid && USER.wait_app_me) return USER.wait_app_me.ready();
        USER.wait_app_me = new DjWaiteReady();
        return $http.post('app/me').then(json => {
          USER.me = json.datas;
          if (!angular.isArray(USER.me.rights)) USER.me.rights = [];
          angular.extend(USER.me, USER["权限分组"](USER.me.rights));
          angular.extend(USER.me, USER.calc_me_data(USER.me.me));
          USER.wait_app_me.resolve(json);
          setTimeout(() => { USER.wait_app_me = false; }, 5000);
          return json;
        }).catch(e => {
          // 失败的，要重新加载
          USER.wait_app_me = false;
        })
      },
      "个人信息": function () {
        if (USER.me && USER.me.uid) return sign.OK(USER.me);
        return USER["刷新个人信息"]();
      },
      "保存个人信息": function (attr) {
        angular.extend(USER.me.attr || (USER.me.attr = {}), attr);
        return $http.post('user/save_info', { attr })
      },
      calc_me_data: function (me) {
        return{
          isAdmin: !!me.is_admin,
          isSysAdmin: (me.is_admin & SYS_ADMIN),
          objAdmin: {
            steefac: me.steefac_can_admin && (me.steefac_can_admin.split(',')) || [],
            steeproj: me.steeproj_can_admin && (me.steeproj_can_admin.split(',')) || [],
          }
        };
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

      /** 未用 */
      aaaa: function () {
        return theRights;
      },
      bbbb: function () {
        return theRights;
      },
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


  };




  /**
   * 本地数据缓存
   */
  theConfigModule.run(['$http', '$q', 'sign', 'LocalStorageTable', function ($http, $q, sign, LocalStorageTable) {

    var cacheAcTable = new LocalStorageTable('cmoss-cache-ac');

    /**
     * 从缓存读取流程数据
     */
    sign.registerHttpHook({
      match: /^cache\/load$/,
      hookRequest: function (config, mockResponse) {
        var param = config.data;
        return mockResponse.resolve(cacheAcTable.select({ ac: param.ac }).then(list => {
          return sign.OK(list[0] || {});
        }));
      }
    });

    /**
     * 保存流程数据到缓存
     */
    sign.registerHttpHook({
      match: /^cache\/save$/,
      hookRequest: function (config, mockResponse) {
        var param = config.data;
        return mockResponse.resolve(cacheAcTable.update({ ac: param.ac }, { data: param.data }, true));
      }
    });


  }]);



  if (0) {


    /** 签名配置 */
    theConfigModule.config(['signProvider', 'SiteConfigProvider', 'UserTokenProvider', function (signProvider, SiteConfigProvider, UserTokenProvider) {

      // 需要验证身份的 api 对应的 url, 已带验证身份用的 queryStr
      function urlSign(api, call) {
        var param = signParam(api, call || '');
        if (!param) return '';
        var url = SiteConfigProvider.apiRoot + api + "/" + call;
        var queryString = Object.keys(param).map(k => {
          return k + "=" + encodeURIComponent(param[k]);
        })
          .join('&');
        return url + '?' + queryString;
      }
      /**
       *  返回签名需要的参数
       */
      function signParam(api, call) {
        var userToken = UserTokenProvider.reload()
        var uid = userToken.data.uid;
        var tokenid = userToken.data.tokenid;
        var token = userToken.data.token;
        if (!tokenid || !token || !api) {
          return false;
        }
        var dt = new Date();
        var timestamp = Math.round((dt.getTime() / 1000)) - 8 * 3600 - dt.getTimezoneOffset() * 60;//修正为东8区
        //var api_signature = md5(api + call + uid + token + timestamp);
        //return { uid, tokenid, timestamp, api_signature, sign };
        var sign = md5(token + timestamp);
        return { uid, tokenid, timestamp, sign };
      }

      signProvider.defaults.apiRoot = SiteConfigProvider.apiRoot;
      signProvider.defaults.sign = function (api, call, SingedRequest) {
        var calls = call.split('/')
        var url = urlSign(api, calls[0]);
        return SingedRequest(url, {});
      }
      // signProvider.defaults.onpost.push(function (api, call, data, signedUrl, postData) {
      //   console.log('拦截api，模拟处理！', api, call, data, signedUrl, postData);
      //   return { signedUrl, postData }
      // });
    }]);

    theConfigModule.config(["$httpProvider", function ($httpProvider) {
      $httpProvider.interceptors.push("http2sign");
    }])

  }
})(angular, window);
