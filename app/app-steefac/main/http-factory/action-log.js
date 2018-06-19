!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config')

  /**
   * 操作记录
   * @param k1: type, steefac/steeproj
   * @param k2: facid
   * @param v1: ac
   * @param v2
   * @param json
   */
  theConfigModule.run(['sign', '$http', function (sign, $http) {
    sign.registerHttpHook({
      match: /^操作记录\/log$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        return mockResponse.resolve($http.post('stee_data/logAction', param));
      }
    });
  }]);


})(angular, window);
