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
      var url = config.url;
      if (!/^(http(s)?\:)?\/\//.test(url)) {
        url = SiteConfig.apiRoot + config.url
      }
      return {
        url: url + "?" + UserToken.reload().signParamString(),
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


  /** 资源路径  */
  !(function () {
    var theFilePathJson = false;

    theConfigModule.run(['$http', '$q', 'sign', function ($http, $q, sign) {

      sign.registerHttpHook({
        match: /^file\/path$/,
        hookRequest: function (config, mockResponse, match) {
          if (theFilePathJson) return mockResponse.resolve(theFilePathJson);
        },
        hookResponse: function (response, $q) {
          return $q.when(response.data).then(json => {

            if (json && +json.errcode === 0) {
              theFilePathJson = json;
              return json;
            }
            return $q.reject(json);
          }).catch(e => {
            theFilePathJson = false;
            return $q.reject(e);
          });
        }
      });

      sign.registerHttpHook({
        match: /^翻译资源$/,
        hookRequest: function (config, mockResponse, match) {
          var param = config.data;
          return mockResponse.resolve($http.post("file/path").then(json => {
            return sign.OK({
              urls: param.urls.map(url => {
                if (!/^(http(s)?\:)?\/\//.test(url)) {
                  url = theFilePathJson.data + "/" + url;
                }
                return url;
              })
            });
          }));
        }
      });

      sign.registerHttpHook({
        match: /\/comment\/comment\/(\w+)$/,
        hookRequest: function (config, mockResponse, match) {
        },
        hookResponse: function (response, $q) {
          return $q.when(response.data).then(json => {
            if (angular.isArray(json.datas.list)) {
              json.datas.list.map(item => {
                if (item.attr && angular.isArray(item.attr.pics)) {
                  item.attr.pics = item.attr.pics.map(url => {
                    if (!/^(http(s)?\:)?\/\//.test(url)) {
                      url = theFilePathJson.data + "/" + url;
                    }
                    return url;
                  })
                }
              });
              console.log("请求评论, 处理图片", json);
            }
            return json;
          }).catch(e => {
            console.log("请求评论, error", e);
            return $q.reject(e);
          });
        }
      });

    }]);


    theConfigModule.filter('assert', function () { //可以注入依赖
      return function (url, size) {
        if (!/^(http(s)?\:)?\/\//.test(url)) {
          url = theFilePathJson.data + "/" + url;
        }
        size = +size;
        if (size > 20 && /^http(s)?\:\/\/\w+\.oss-cn-beijing\.aliyuncs\.com/.test(url)) {
          return url + `?x-oss-process=image/resize,m_fill,h_${size},w_${size}`
        }
        return url;
      }
    });
  })();



  /** 用户模块 */
  theConfigModule.run(['$rootScope', '$http', '$q', '$timeout', 'sign', 'DjWaiteReady', confogUser]);

  function confogUser($rootScope, $http, $q, $timeout, sign, DjWaiteReady) {
    const SYS_ADMIN = 0x10000;

    function emptyWx(uid) {
      return {
        headimgurl: "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets/img/anonymous.png",
        nickname: "",
        uid
      }
    }

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
        return {
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
      wxCache: [
        { headimgurl: "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets/img/anonymous.png", nickname: "匿名", uid: 0 }
      ],
      "微信数据": function (uids) {
        uids = uids.uids || uids;
        var uidIsArray = angular.isArray(uids);
        if (!uidIsArray) uids = [uids];

        var uidAllCache = USER.wxCache;//.map(row => row.uid);
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
          console.log("微信数据", json);
          list.map(item => USER.wxCache.push(item));
          return sign.OK(uidIsArray ?
            //{ list: USER.wxCache.filter(row => uids.indexOf(row.uid) >= 0) }
            {
              list: uids.map(uid => {
                return USER.wxCache.find(item => item.uid == uid) || emptyWx(uid)
              })
            }
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
     * 从缓存读取数据
     */
    sign.registerHttpHook({
      match: /^cache\/load$/,
      hookRequest: function (config, mockResponse) {
        var param = config.data;
        return mockResponse.resolve(cacheAcTable.select(param).then(list => {
          return sign.OK(list[0] || {});
        }));
      }
    });

    /**
     * 保存数据到缓存
     */
    sign.registerHttpHook({
      match: /^cache\/save$/,
      hookRequest: function (config, mockResponse) {
        var param = config.data;
        return mockResponse.resolve(cacheAcTable.update({ ac: param.ac }, { data: param.data }, true));
      }
    });


  }]);

})(angular, window);
