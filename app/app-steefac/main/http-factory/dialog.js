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
        if (!angular.isArray(param) && angular.isObject(param)) {
          if(param.body){
            param = [param.body, param.title, param.options]
          }
          else{
            param = Object.keys(param).map(k => param[k]);
          }
        }
        return mockResponse.resolve(DjDialog[match[1]].apply({}, param));
      }
    });
  }]);


})(angular, window);
