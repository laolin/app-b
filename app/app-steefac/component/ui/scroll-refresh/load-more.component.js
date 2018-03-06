/**
 * 下拉刷新组件
 * ver: 0.0.1
 * build: 2018-01-25
 * power by LJH.
 */
!(function (window, angular, undefined) {
  'use strict';

  angular.module('steefac')
    .directive('loadMore', function () {
      return {
        restrict: 'AE',
        transclude: {
          'body': '?loadMoreBody'
        },
        templateUrl: 'app-steefac/component/ui/scroll-refresh/load-more.template.html',
        scope: {
          listShow: '=?', // 如果有该参数，表示父组件中，将使用这个参数显示列表，且此参数将由本组件从listBase自动添加数据
          listBase: '=?', // 当有 listShow 参数时，有用。全部显示时，即为显示本数组
          totle: '@', // 当没有 listShow 参数时，有用，将通知父组件，自行显示
          loaded: '@', // 当没有 listShow 参数时，有用，由父组件告知本组件已显示了几项，以判断是已显示到底了
          pageSize: '@',
          onLoadMore: '&'
        },
        controller: ['$scope', '$q', ctrl]
      };
    });


  function ctrl($scope, $q) {
    $scope.$watch('pageSize', pageSize => {
      page.pageSize = pageSize || 16;
    });
    $scope.$watch('totle', initAutoShow);
    $scope.$watch('loaded', initAutoShow);
    $scope.$watch('listShow', initAutoShow);
    $scope.$watch('listBase', initAutoShow);
    function initAutoShow() {
      if ($scope.listShow && $scope.listBase) {
        page.totle = $scope.listBase.length;
        page.loaded = $scope.listShow.length;
        $scope.loadMore();
      }
      else {
        page.totle = +$scope.totle;
        page.loaded = +$scope.loaded;
      }
    }
    /* 分页 */
    var page = $scope.page = {
      totle: 0,
      loaded: 0,
      pageSize: 16
    }

    /* 下拉刷新 */
    !(function () {
      $scope.isTopMost = true; // 是否滚动到最上边？若是，则隐藏“回到顶部”按钮
      $scope.allLoaded = 0; // 已全部加载，再下拉时，加1。用于动态改变底部提示文字
      $scope.checkTop = function (isTopMost) {
        $scope.isTopMost = isTopMost;
      }

      $scope.loading = false;
      $scope.loadMore = function (event, top, isTopMost) {
        if($scope.loading) return;
        // 父组件不显示，则由本组件进行默认显示
        if ($scope.listShow && $scope.listBase) {
          if ($scope.listShow.length >= page.totle) {
            $scope.allLoaded++;
          }
          var b = $scope.listShow.length;
          for (var i = b; i < b + page.pageSize && i < page.totle; i++) {
            $scope.listShow.push($scope.listBase[i]);
          }
          page.loaded = $scope.listShow.length;
        }
        else{
          $scope.loading = true;
          $q.when($scope.onLoadMore(event, top, isTopMost))
          .then(() => {
            $scope.loading = false;
          })
          .catch( e => {
            console.log("下拉刷新失败：", e);
            $scope.loading = false;
          })
        }
      }
    })();
  }
})(window, angular);