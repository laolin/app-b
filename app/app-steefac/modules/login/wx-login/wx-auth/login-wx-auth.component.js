!(function (window, angular, undefined) {

  var idWxLoginDiv = 'wx-lg_cnt_' + (+new Date());
  var isWx = (/micromessenger/i).test(navigator.userAgent);

  /**
   * 微信浏览器中，网页授权登录
   * 在 angular.module 启动前, angular.dj.wxAuth.authUrl() 函数可用
   */
  angular.extend(angular.dj || (angular.dj = {}), (function () {
    var wxAuth = {
      authUrl: (redirect_page, pageTo) => {
        var auhParam = getAuhParam(redirect_page, pageTo, 'wx');

        var wxAuthUrl =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + auhParam.appid +
          '&redirect_uri=' + auhParam.redirect_uri +
          '&response_type=code&scope=snsapi_userinfo&state=' + auhParam.state +
          '#wechat_redirect';
        return wxAuthUrl;
      }
    }
    return {
      isWx: isWx,
      wxAuth,
    };
  })());


  angular.module('dj-wx')
    .component('loginWxAuth', {
      template: `<div id="${idWxLoginDiv}" class="text-center">Loading weixin ...</div>`,
      bindings: {
        pageTo: '<'
      },
      controller: ['$scope', '$location', '$http', ctrl]
    });

  function ctrl($scope, $location, $http) {
    var pageTo = $location.search().pageTo;
    if (isWx) {
      if (/^\/login(\/.*)?$/.test(pageTo)) pageTo = '/';
      var wxAuth = angular.dj.wxAuth.authUrl(location.href, pageTo);
      location.href = wxAuth;
      return;
    }
    this.$onInit = function () {
      var auhParam = getAuhParam(location.href, pageTo, 'web');
      var wx_src = "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
      if (typeof (WxLogin) == 'undefined') {
        $http.jsonp(wx_src).finally(json => {
          showWxLogin(auhParam);
        });
      } else {
        showWxLogin(auhParam);
      }

    }
    function showWxLogin(auhParam) {
      new WxLogin(angular.extend({}, auhParam, {
        id: idWxLoginDiv,
        scope: "snsapi_login",
        style: "",
        href: ""
      }));
    }
  }


  /**
   * 获取微信二维码登录参数
   * @param {string} href : 登录成功后，将跳转到的页面, hash 部分无效，且自动添加#!/wx-code-login
   * @param {string} hash : 在 wx-code-login 调用成功后，将跳转到的页面
   * @param {string} appName : 第三方授权的微信公众号自定义名称，前后端约定
   */
  function getAuhParam(redirect_page, pageTo, appName) {
    var theSiteConfig = angular.extend({}, angular.dj.siteConfig, window.theSiteConfig);
    var appid = theSiteConfig.wx_app[appName].appid;
    var state = btoa(pageTo || '');
    var redirect_uri = ((redirect_page) => {
      //var loginHash = (/\#\!/.test(window.location.hash) ? "#!" : "#") + "/wx-code-login";
      //bug: 首页不带#路径打开时，上一行location.hash是空 ，会导致使用#，进而导致不能跳到正确的路由
      var loginHash =  "#!" + "/wx-code-login"; //本项目应该总是使用 #! ，不会有使用 # 的情况
      var para1 = theSiteConfig.wx_app[appName].name;

      //这里有加上随机数，'/'+ (+new Date) ，否则微信不刷新，会导致不会去真的登录
      var para2 = encodeURIComponent(btoa(redirect_page.split("#")[0] +'/'+ (+new Date) + loginHash));
      return `${theSiteConfig.wx_authApiBase}/${para1}/${para2}`;
    })(redirect_page);
    return {
      appid,
      state,
      redirect_uri
    }
  }

})(window, angular);
