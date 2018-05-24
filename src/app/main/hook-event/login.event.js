!(function (angular, window, undefined) {

  var theConfigModule = angular.module('dj-view');

  /**
   * 用户登录
   */
  theConfigModule.run(['$rootScope', 'SiteConfig', 'UserToken', function ($rootScope, SiteConfig, UserToken) {

    $rootScope.$on('loginByWxCodeSuccess', function(event, data){
      console.log("微信登录成功，", data);
      var tokenData = data.json.datas;
      UserToken.save(tokenData);
      API.setCookie("user_id", tokenData.id);
      API.setCookie("user_password", tokenData.password);

      gotoPage(data.pageTo);
    });

    $rootScope.$on('loginByUserFormSuccess', function(event, data){
      console.log("用户表单登录成功，", data);
      UserToken.save(tokenData);
      var tokenData = data.json.datas;
      API.setCookie("user_id", tokenData.id);
      API.setCookie("user_password", tokenData.password);

      gotoPage(data.pageTo);
    });


    function gotoPage(pageTo){
      pageTo = pageTo || '';
      if(/\/login/.test(pageTo)) pageTo = '';
      location.hash = (/\#\!/.test(window.location.hash) ? "#!" : "#") + pageTo;
    }

  }]);

})(angular, window);
