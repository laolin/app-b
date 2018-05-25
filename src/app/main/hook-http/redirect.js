!(function (angular, window, undefined) {

  var theConfigModule = angular.module('dj-http');

  /**
   * 微信登录。也可不拦截，但是多传递了些签名数据
   */
  theConfigModule.run(['sign', 'SiteConfig', function (sign, SiteConfig) {
    sign.registerHttpHook({
      match: /^app\/wx_code_login$/,
      hookRequest: function (config, mockResponse, match) {
        return {
          url: SiteConfig.apiRoot + "user/wx_code_login" ,
          post: config.data,
        };
      }
    });
  }]);

})(angular, window);
