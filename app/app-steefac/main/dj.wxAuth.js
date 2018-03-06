!(function (window, angular, undefined) {

  /**
   * 微信浏览器中，网页授权登录
   */
  angular.extend(angular.dj || (angular.dj = {}), (function () {
    var wxAuth = {
      auhUrl: (href, hash) => {
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
      isWx: (/micromessenger/i).test(navigator.userAgent),
      wxAuth,
    };
  })());

})(window, angular);
