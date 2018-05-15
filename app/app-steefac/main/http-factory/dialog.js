!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config')

  /**
   * 显示对话框
   */
  theConfigModule.run(['sign', 'DjPop', function (sign, DjPop) {
    sign.registerHttpHook({
      match: /^显示对话框\/(.*)$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        if (!angular.isArray(param) && angular.isObject(param)) {
          if(param.componentName){
            param = [param.componentName, param.params, param.options]
          }
          else if(param.body){
            param = [param.body, param.title, param.options]
          }
          else{
            param = Object.keys(param).map(k => param[k]);
          }
        }
        return mockResponse.resolve(DjPop[match[1]].apply({}, param));
      }
    });
  }]);


})(angular, window);
