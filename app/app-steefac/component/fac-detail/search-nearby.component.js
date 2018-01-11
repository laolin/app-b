/**
 * 搜索附近组件
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('searchNearby',{
    templateUrl: 'app-steefac/component/fac-detail/search-nearby.template.html',
    bindings: {
      fac: '<'
    },
    controller:['$scope', '$location', 'FacSearch', ctrl]
  });


  function ctrl($scope, $location, FacSearch) {
    var ctrl = this;
    $scope.FacSearch = FacSearch;
    $scope.dist = -1;
    /**
     * 搜索
     */
    $scope.search = function(searchType){
      var param = {
        searchType : searchType,
        distSelect : $scope.dist,
        lat: ctrl.fac.latE7/1E7,
        lng: ctrl.fac.lngE7/1E7,
      };
      $location.path('/search/searching').search(param);
    }
  }
})(window, angular);