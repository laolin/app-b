!(function (angular, window, undefined) {

  var theConfigModule = angular.module('dj-http')

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
          // for input
          else if(match[1]=='input' && param.title){
            param = [param.title, param.text];
          }
          // for toast
          else if(match[1]=='toast' && param.text){
            param = [param.text, param.delay];
          }
          // for alert/confirm
          else if(param.body){
            param = [param.body, param.title, param.options];
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
