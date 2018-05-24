!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config', ['dj-service'])


  /** 签名配置 */
  // theConfigModule.config(['signProvider', 'SiteConfigProvider', 'UserTokenProvider', function (signProvider, SiteConfigProvider, UserTokenProvider) {
  //   signProvider.setApiRoot(SiteConfigProvider.apiRoot);
  //   signProvider.registerDefaultRequestHook((config, mockResponse) => {
  //     return {
  //       url: SiteConfigProvider.apiRoot + config.url,
  //       post: angular.extend({}, UserTokenProvider.reload().signToken(), config.data)
  //     }
  //   });
  // }]);

  theConfigModule.value("UserToken", {});
  /**
   * 仅仅签名
   */
  theConfigModule.run(['sign', 'SiteConfig', 'UserToken', function (sign, SiteConfig, UserToken) {
    sign.registerHttpHook({
      match: /^签名$/,
      hookRequest: function (config, mockResponse, match) {
        console.log("签名");
        var param = config.data;
        var url = param.url || param || "";
        var data = param.data || {};
        return mockResponse.resolve(sign.OK({
          url: SiteConfig.apiRoot + url,
          //data: angular.extend({}, UserToken.reload().signToken(), data),
          data: angular.extend({}, data),
        }));
      }
    });
  }]);
  //___________________________________
})(angular, window);
