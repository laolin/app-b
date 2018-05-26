!(function (angular, window, undefined) {

  var theConfigModule = angular.module('dj-http');

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
          data: angular.extend({}, UserToken.reload().signToken(), data)
        }));
      }
    });
  }]);

})(angular, window);
