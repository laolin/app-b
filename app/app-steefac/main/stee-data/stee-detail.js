!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config')

  /**
   * 产能详情
   */
  theConfigModule.run(['$http', '$q', 'sign', 'DjDialog', function ($http, $q, sign, DjDialog) {


    sign.registerHttpHook({
      match: /^产能详情$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        var facid = param.facid;
        var type = param.type;
        var confirm = param.confirm;

        return mockResponse.resolve(
          $http.post('stee_data/obj_detail', {type, facid, confirm}).then(json => {
            var limit = json.datas.limit;
            if (!limit) return json;
            var dontDialog = limit.max - limit.used >= 5;
            if (dontDialog) {
              return $http.post('产能详情', { type, facid, confirm: 1 });
            }
            return DjDialog.modal({
              title: `今日额度 ${limit.max} 条，已用 ${limit.used} 条`,
              body: `查看 该项目 详情？`
            }).then(() => {
              return $http.post('产能详情', { type, facid, confirm: 1 });
            });

          })
        );
      }
    });

    sign.registerHttpHook({
      match: /^请求电话号码$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        return mockResponse.resolve(
          $http.post('stee_data/contact_tel', param)
        );
      }
    });

  }]);


})(angular, window);
