
!(function (window, angular, undefined) {

  /** 登记可用的登录模式 */
  function getLoginComponent(mode) {
    var indexes = {
      "wx": "login-by-wx-oath",
      "wx-code": "login-by-wx-code",
      "default": "login-by-user-form",
    }
    return indexes[mode] || indexes['default'];
  }

  var theModule = angular.module("dj-view");

  theModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('login', {
        pageTitle: "登录",
        requireLogin: false,
        url: '/login?mode&pageTo&code',
        //templateUrl: templateUrl('view/login/login.html'),
        templateProvider: ["$stateParams", function ($stateParams) {
          console.log("模板参数", arguments);
          var componentName = getLoginComponent($stateParams.mode);
          var pageTo = $stateParams.pageTo || '';
          return `<${componentName} page-to="'${pageTo}'"></${componentName}>`
        }],
        controller: ['$scope', '$http', function () { }]
      })
      .state('wx-code-login', {
        pageTitle: "登录",
        requireLogin: false,
        url: '/wx-code-login',
        //templateUrl: templateUrl('view/login/login.html'),
        template: `<login-by-wx-code></login-by-wx-code>`,
        controller: ['$scope', '$http', function () { }]
      })
  }]);

})(window, angular);
