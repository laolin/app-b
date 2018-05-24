
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
        url: '/login',
        //templateUrl: templateUrl('view/login/login.html'),
        templateProvider: ["$location", function ($location) {
          var search = $location.search();
          console.log("模板参数", search, arguments);
          var componentName = getLoginComponent(search.mode);
          return `<${componentName} page-to="'${search.pageTo}'"></${componentName}>`
        }],
        controller: ['$scope', '$http', function () { }]
      })
      .state('login-all', {
        pageTitle: "登录",
        url: '/login/:mode',
        //templateUrl: templateUrl('view/login/login.html'),
        templateProvider: ["$stateParams", function ($stateParams) {
          console.log("模板参数", arguments);
          var componentName = getLoginComponent($stateParams.mode);
          return `<${componentName} page-to="pageTo"></${componentName}>`
        }],
        controller: ['$scope', '$http', function () { }]
      })
  }]);

})(window, angular);
