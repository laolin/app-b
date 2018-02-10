/**
 * 个人详情页面
 * ver: 0.0.1
 * build: 2018-02-03
 * power by LJH.
 */
!(function (window, angular, undefined){
  var thisLocationPath = "/user-show";

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when(thisLocationPath, {
      pageTitle: "用户详情",
      requireLogin: 'super-admin',
      templateUrl: 'app-steefac/view/user-admin/user-show/user-show.template.html',
      controller: ['$scope', '$location', 'AppbData', 'FacUser', ctrl]
    });
  }]);

  function ctrl($scope, $location, AppbData, FacUser) {
    var search = $location.search();
    var userid = $scope.userid = search.userid;

    /**
     * 加载用户数据
     */
    $scope.dataReady = false; // 正在加载标志
    FacUser.SIGN.post('sa_data', 'getUserInfo', {userid})
    .then( json => {
      $scope.dataReady = true;
      $scope.user = json.datas;
    })


  }
})(window, angular);