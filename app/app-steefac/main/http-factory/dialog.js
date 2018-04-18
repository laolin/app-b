!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config')

  /**
   * 显示对话框
   */
  theConfigModule.run(['sign', 'DjDialog', function (sign, DjDialog) {
    sign.registerHttpHook({
      match: /^显示对话框\/(.*)$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        return mockResponse.resolve(DjDialog[match[1]].call(param));
      }
    });
  }]);


})(angular, window);
