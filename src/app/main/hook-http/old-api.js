!(function (angular, window, undefined) {

  var theConfigModule = angular.module('dj-http');

  /**
   * 拦截旧 API 请求。 请求时，加前缀 old-api/
   */
  theConfigModule.run(['sign', 'SiteConfig', 'UserToken', function (sign, SiteConfig, UserToken) {

    function sign_post(data) {
      var token_data = UserToken.load().data;
      var password = token_data.password;
      var uid = token_data.id;
      var t = (new Date().getTime() / 1000).toFixed();
      if (!angular.isObject(data)) data = {};
      data.module = data.module || API.module;
      data.uid = uid;
      data.t = t;
      data.sign = MD5(t + password);
      return data;
    }

    sign.registerHttpHook({
      match: /^old-api(\/.*)$/,
      hookRequest: function (config, mockResponse, match) {
        var url = SiteConfig.apiRoot_old + match[1];
        return {
          url,
          post: sign_post(config.data)
        }
      }
    });
  }]);

})(angular, window);
