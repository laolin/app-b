/**
 * 项目详情页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {

  angular.module('dj-wx')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/wx-code-login', {
          pageTitle: "微信code登录",
          requireLogin: false,
          template: '正在登录中...',
          controller: ['$scope', '$location', '$http', ctrl]
        });
    }]);

  function ctrl($scope, $location, $http) {
    var search = $location.search();
    $http.post('app/wx_code_login', {
      name: search.app,
      code: search.code
    }, {
        signType: 'single'
      }).then(json => {
        angular.dj.userToken.save(json.datas);
        var pageTo = atob(search.state);
        //location.hash = '#!' + pageTo;
        $location.path(pageTo).search({});
      }).catch(json => {
        console.log('静态api, 拒绝', json);
      });

  }
})(window, angular);