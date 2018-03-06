!(function (angular, window, undefined) {

  angular.module('app-run', ['dj-login'])

    .run(['$rootScope', '$location', '$q', 'FacUser', 'APP', function ($rootScope, $location, $q, FacUser, APP) {
      /**
       * 路由监听，设置标题，设置微信分享
       */
      $rootScope.$on('$routeChangeSuccess', function (evt, current, prev) {
        let route = current.$$route;
        console.log('页面改变: ', route);
        requireLogin(route).catch(e => {
          var pageTo = current.originalPath || '/';
          // 防止回来时，又跳转到登录页面
          if(/^\/login(\/.*)?$/.test(pageTo)) pageTo = '/';
          $location.path("/login").search({pageTo}).replace();
        });
      });

      function requireLogin(route) {
        var userToken = APP.UserToken.reload()
        var isLogged = userToken.hasToken();
        if (route.requireLogin === false) {
          return $q.when('不要求登录');
        }
        if (!isLogged) {
          return $q.reject('未登录');
        }
        return FacUser.getMyData(true).then( me =>{
          if (route.requireLogin == 'super-admin') {
            console.log('请求超级管理员...');
            if (!FacUser.isAdmin()) {
              return $q.reject('已登录, 但不是超级管理员');
            }
            return '超级管理员, 已登录';
          }
          else{
            console.log('请求普通用户登录...');
            return '普通用户, 已登录';
          }
        })
        .catch(e => {
          if (route.requireLogin == 'super-admin') {
            return $q.reject('超级管理员, 未登录');
          }
          else{
            return $q.reject('普通用户, 未登录');
          }
        })
      }
    }])

  //___________________________________
})(angular, window);
