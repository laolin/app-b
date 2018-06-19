/**
 * 项目详情页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {

  angular.module('dj-login')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/login', {
          redirectTo: '/login/wx-auth'
        })
        .when('/login-test', {
          pageTitle: "登录测试",
          requireLogin: false,
          template: '登录测试',
        })
        .when('/login/:login_mode', {
          pageTitle: "登录",
          requireLogin: false,
          template: '<login-host mode="loginMode" page-to="pageTo"></login-host>',
          controller: ['$scope', '$routeParams', '$location', ctrl]
        });
    }]);

  function ctrl($scope, $routeParams, $location) {
    $scope.loginMode = $routeParams.login_mode || 'wx-auth';
    $scope.pageTo = $location.search().pageTo;
  }
})(window, angular);