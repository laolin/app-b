!(function (window, undefined) {

  return angular.bootstrap(document, ["appb.main"]);

  /** 2018过年 */
  angular.module('new-year-2008', [
    'dj-service',
    'app-config',
  ])
  .component('myApp',{
    template: `<img style="width:100%" src="http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets/img/16-9.jpg">`,
    controller:['$scope', '$http', "SIGN", function ($scope, $http, SIGN) {
      console.log("收到拜年");
      $http.post("stee_data/logAction", {k1: '收到拜年'})
      //SIGN.post("stee_data", "logAction", {k1: '收到拜年'})
      .then( json =>{
        console.log("2018过年, 已记录", json)
      })
      .catch( e => {
        console.log("2018过年, 未记录", e)
      })
    }]
  })
  angular.bootstrap(document, ["new-year-2008"]);




})(window);
