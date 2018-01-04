/**
 * 搜索结果组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('searchResult', {
    templateUrl: 'app-steefac/component/search/search-result.template.html',
    bindings: {
      result: '<'
    },
    controller:['$scope', '$location', 'FacSearch', 'ProjDefine', ctrl]
  });

	function ctrl($scope, $location, FacSearch, ProjDefine) {
    $scope.FacSearch = FacSearch;
    $scope.ProjDefine = ProjDefine;
    var ctrl=this;
    ctrl.$onChanges=function(chg){
      $scope.dataReady = !!ctrl.result;
      initPage();
    }

    /**
     * 分页
     */
    $scope.dataReady = false;
    $scope.list = [];
    var page = $scope.page = {
      totle: 0,
      current: 0,
      minSize: 8,
      size: 8
    }
    function initPage(){
      $scope.list = [];
      if(!ctrl.result) return;
      page.totle = ctrl.result.length || 0;
      page.size = page.minSize;
      for(var i = 0; i < page.size && i < page.totle; i++){
        $scope.list.push(ctrl.result[i]);
      }
    }
    /**
     * 下拉刷新
     */
    $scope.isTopMost = true;
    $scope.checkTop = function(isTopMost){
      $scope.isTopMost = isTopMost;
    }
    $scope.allLoaded = 0;
    $scope.loadMore = function(event, top, isTopMost){
      console.log('分页, top=', top, ',isTopMost=', isTopMost);
      if(page.size >= page.totle){
        $scope.allLoaded ++;
      }
      for(var i = 0 ; i< page.minSize && page.size < page.totle; i++, page.size++){
        $scope.list.push(ctrl.result[page.size]);
      }
    }

    /**
     * 点击
     */
    var routers = {
      steefac: '/fac-detail/',
      steeproj: '/project-detail/',
    }
    $scope.clickItem = function(item){
      console.log(item);
      return $location.path(routers[FacSearch.searchType] + item.id).search({});
    }
  }
})(window, angular);