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
      console.log('搜索结果组件');
    ctrl.$onChanges=function(chg){
      initPage();
    }

    /**
     * 分页
     */
    $scope.list = [];
    var page = $scope.page = {
      current: 0,
      size: 6
    }
    function initPage(nthPage){
      nthPage = nthPage || 0;
      $scope.list = [];
      var result = ctrl.result;
      if(!result) return;
      for(var i = 0; i< page.size; i++){
        if(nthPage * page.size + i < result.length)
        $scope.list.push(result[nthPage * page.size + i]);
      }
    }

    /**
     * 分页
     */
    var routers = {
      steefac: '/fac-detail/',
      steeproj: '/project-detail/',
    }
    $scope.clickItem = function(item){
      console.log(item);
      //return $location.path("/fac-detail/" + item.id).search({});
      return $location.path(routers[FacSearch.searchType] + item.id).search({});

    }
  }
})(window, angular);