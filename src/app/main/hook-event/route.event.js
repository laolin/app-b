!(function (angular, window, undefined) {

  var theConfigModule = angular.module('dj-view');

  /**
   * 路由监听，微信分享
   */
  theConfigModule.run(['$rootScope', '$http', '$q', '$state', 'UserToken', function ($rootScope, $http, $q, $state, UserToken) {

    /** 是否要求登录 */
    function checkNeedLogin(state) {
      var requireLogin = state.requireLogin;
      if (angular.isFunction(requireLogin)) {
        requireLogin = requireLogin();
      }
      if (requireLogin === false) return false;
      if (!requireLogin) return true; // 不是 false 的其它情况
      return requireLogin;
    }




    /** 路由监听 */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options, $transition) {
      var wxShareParam = toState.wxShareParam;
      $http.post("WxJssdk/setShare", wxShareParam);

      var needLogin = checkNeedLogin(toState);
      var hasToken = UserToken.hasToken();
      var token_data = UserToken.load().data;
      var unLogged = ! hasToken || !token_data.id

      console.log('判断登录', needLogin, !unLogged);
      $http.post("验证登录", {toState, toParams});

      if(needLogin && unLogged){
        event.preventDefault();
        $http.post("请求登录", {toState, toParams}).then(json=>{
          $state.go(toState.name, toParams);
        });
      }
      // console.log("stateChangeStart", event, toState, toParams, fromState, fromParams, options, $transition);
    });

    $rootScope.$on('$viewContentLoading', function (event, data, b) {
      //console.log("viewContentLoading", event, data, b);
    });
    function viewContentLoading(event, data, b) {
      console.log("viewContentLoading", event, data, b);
    }

  }]);

})(angular, window);
