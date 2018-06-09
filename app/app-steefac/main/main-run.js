!(function (window, angular, undefined) {

  //return runLogged();

  var theSiteConfig = angular.extend({}, angular.dj.siteConfig, window.theSiteConfig)
  var loginUrlBase = theSiteConfig.apiRoot + "/app/verify_token";

  /**
   * 系统启动，判断是否登录，并区分处理
   * * 请不要在其它代码中运行影响浏览器跳转的代码
   */
  angular.dj.userToken.checkLogin(loginUrlBase, runLogged, runNotLogged);


  /**
   * 1. 已登录情况
   */
  function runLogged() {
    console.log('原已登录');
    angular.bootstrap(document, ["appb.main"]);
  }

  /**
   * 2. 未登录情况, 区分是否在微信浏览器中
   */
  function runNotLogged() {
    console.log('未登录');
    if (angular.dj.isWx) {
      runNotLoggedIsWx();
    }
    else {
      runNotLoggedNotWx();
    }
  }

  /**
   * 2.1 未登录, 不是微信浏览器
   */
  function runNotLoggedNotWx() {
    console.log('未登录, 不是微信');
    angular.bootstrap(document, ["appb.main"]);
  }

  /**
   * 2.2 未登录, 是微信, 区分有没有 code
   */
  function runNotLoggedIsWx() {

    var hasCode = (/\/wx-code-login(\?|\?.*\&)code\=/i).test(window.location.hash);
    if (hasCode) {
      // 按已登录处理，在 /wx-code-login 页面中将进行登录
      runLogged();
    }
    else {
      var wxAuth = angular.dj.wxAuth.authUrl(location.href, location.hash.substr(2,9999));
      location.href = wxAuth;
    }
  }

})(window, angular);
