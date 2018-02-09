/**
 * 用户搜索页面
 * ver: 0.0.1
 * build: 2018-02-03
 * power by LJH.
 */
!(function (window, angular, undefined){
  var thisLocationPath = "/user-search";

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when(thisLocationPath, {
      pageTitle: "用户管理",
      requireLogin: 'super-admin',
      templateUrl: 'app-steefac/view/user-admin/user-search/user-search.template.html',
      controller: ['$scope', '$location', 'AppbData', 'FacUser', ctrl]
    });
  }]);

  function ctrl($scope, $location, AppbData, FacUser) {
    var search = $location.search();
    $scope.text = search.text || '';
    if($scope.text){
      FacUser.SIGN.post("stee_data", "search_user", {text: $scope.text})
      .then( json => json.datas.list )
      .then( list => {
        $scope.list = list;
      })
      .catch(e => {
        console.log('查找失败：', e);
      })
    }
    $scope.search = () => {
      $scope.text && $location.path(thisLocationPath).search({text: $scope.text}).replace();
    }

    /* 实际已显示的列表，由下拉刷新组件添加数据 */
    $scope.listShow = [];
  }
})(window, angular);