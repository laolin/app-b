/**
 * 搜索页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';
  var config = {
    templateUrl: 'app-steefac/search/search.view.template.html',
    controller: ['$scope','$routeParams','$log','$location','AppbData','FacSearch','FacMap',ctrl]
  }
  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/search', config)
      .when('/search/:ac', config);
  }]);

  function ctrl($scope, $routeParams,$log,$location,AppbData,FacSearch,FacMap) {


    $scope.appData = AppbData.getAppData();

    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }
    $scope.FacSearch = FacSearch;

    /**
     * 搜索
     */
    $scope.research = function(searchType){
      var param = {
        searchType: searchType || FacSearch.searchType,
        distSelect: $scope.search.distSelect,
        level     : $scope.search.level     ,
        orderBy   :$scope.search.orderBy    ,
      };
      if($location.$$path == "/search"){
        $location.path('/search/searching').search(param);
      }
      else{
        $location.replace('/search/searching').search(param);
      }
    }

    if($routeParams.ac == 'searching'){
      $scope.searching = true;
      $scope.searchResult = [];
      $scope.search = FacSearch.options;
      angular.extend(FacSearch.options, {
        //currentCity: "上海市杨浦区",
        //monthBetween: {from:'2017.12', to:'2018.3'},
        distSelect: $location.$$search.distSelect,
        level     : $location.$$search.level     ,
        orderBy   : $location.$$search.orderBy   ,
      });
      FacSearch.startSearch($location.$$search.searchType || FacSearch.searchType, 'dontReLocation').then(function(res){
        $scope.searchResult = res;
      });
    }

    else{
      $scope.searching = false;
      FacSearch.d = {
        currentCity: "上海市杨浦区",
        monthBetween: {from:'2017.12', to:'2018.3'}
      }

      var appData=AppbData.getAppData();

      appData.setPageTitle('搜索钢构产能');
      $scope.$on('$viewContentLoaded', function () {
        if(!FacMap.searchMarkers.length)
          FacMap.selPositionStart('search','选点搜周边');
        FacSearch.showSearchMarkers(1,FacSearch.searchType);

      });
      $scope.$on('$destroy', function () {
        FacSearch.showSearchMarkers(0,FacSearch.searchType);
        FacSearch.hideInfoWindow();
        FacMap.selPositionEnd();
      });

      $scope.searchResult = [];
      $scope.search = FacSearch.options;
      angular.extend(FacSearch.options, {
        currentCity: "上海市杨浦区",
        monthBetween: {from:'2017.12', to:'2018.3'},
        level: "all",
        orderBy: '按距离排序'
      });
    }
  }
})(window, angular);