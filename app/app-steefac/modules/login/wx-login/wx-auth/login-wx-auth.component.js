!(function (window, angular, undefined) {

  var idWxLoginDiv = 'wx-lg_cnt_' + (+new Date());
  var isWx = (/micromessenger/i).test(navigator.userAgent);

  /**
   * 微信浏览器中，网页授权登录
   * 在 angular.module 启动前, angular.dj.wxAuth.authUrl() 函数可用
   */
  angular.extend(angular.dj || (angular.dj = {}), (function () {
    var wxAuth = {
      authUrl: (href, hash) => {
        var theSiteConfig = angular.extend({}, angular.dj.siteConfig, window.theSiteConfig);
        var appid = theSiteConfig.wx_app.wx.appid;
        var state = theSiteConfig.wx_markWxLoginCallback + '~' + theSiteConfig.wx_app.wx.name;
        var redirect_uri = ((href, hash) => {
          var para1 = btoa(href.split("#")[0] + "#!/wx-code-login");
          para1 = para1.replace('/', '_');//由于 base64的第64个字符是 '/'，要替换为 '_'
          var para2 = btoa(encodeURIComponent(hash));
          return `${theSiteConfig.wx_authApiBase}/bindwx/callback_bridge/${para1}/${para2}`;
        })(href, hash);
        var wxAuthUrl =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid +
          '&redirect_uri=' + redirect_uri +
          '&response_type=code&scope=snsapi_userinfo&state=' + state +
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
    console.log("微信登录.........")
    if(isWx){
      var pageTo = this.pageTo;
      if(/^\/login(\/.*)?$/.test(pageTo)) pageTo = '/';
      var wxAuth = angular.dj.wxAuth.authUrl(location.href, pageTo);
      location.href = wxAuth;
      return;
    }
    this.$onInit = function () {
      console.log("微信登录: pageTo=", this.pageTo);
      var auhParam = getAuhParam(location.href, this.pageTo, 'web');
      var wx_src = "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
      if (typeof (WxLogin) == 'undefined') {
        $http.jsonp(wx_src).finally( json => {
          console.log("json = ", json);
          showWxLogin(auhParam);
        });
      } else {
        showWxLogin(auhParam);
      }

    }
    function showWxLogin(auhParam){
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
  function getAuhParam(href, hash, appName) {
    var theSiteConfig = angular.extend({}, angular.dj.siteConfig, window.theSiteConfig);
    var appid = theSiteConfig.wx_app[appName].appid;
    var state = theSiteConfig.wx_markWxLoginCallback + '~' + theSiteConfig.wx_app[appName].name;
    var redirect_uri = ((href, hash) => {
      var para1 = btoa(href.split("#")[0] + "#!/wx-code-login");
      para1 = para1.replace('/', '_');//由于 base64的第64个字符是 '/'，要替换为 '_'
      var para2 = btoa(hash);
      return `${theSiteConfig.wx_authApiBase}/bindwx/callback_bridge/${para1}/${para2}`;
    })(href, hash);
    return {
      appid,
      state,
      redirect_uri
    }
  }

})(window, angular);
