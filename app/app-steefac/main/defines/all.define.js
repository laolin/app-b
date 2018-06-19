!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config')

  /**
   * 所有定义
   */
  theConfigModule.run(['sign', 'FacDefine', 'ProjDefine', function (sign, FacDefine, ProjDefine) {
    sign.registerHttpHook({
      match: /^define$/,
      hookRequest: function (config, mockResponse) {
        var param = config.data;
        return mockResponse.resolve({
          fac: FacDefine,
          proj: ProjDefine,
        });
      }
    });
  }]);


})(angular, window);
