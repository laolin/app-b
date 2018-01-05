/**
 * 搜索页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';
  var config = {
    templateUrl: 'app-steefac/view/search/search.view.template.html',
    controller: ['$scope','$routeParams','$log','$location','AppbData','FacSearch','FacMap',ctrl]
  }
  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/search', config)
      .when('/search/:ac', config);
  }]);

  function ctrl($scope, $routeParams,$log,$location,AppbData,FacSearch,FacMap) {
    appData.setPageTitle('搜索');

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
      var monthBetween = $scope.search.monthBetween || {};
      var param = {
        searchType : searchType || FacSearch.searchType,
        distSelect : $scope.search.distSelect  ,
        level      : $scope.search.level       ,
        orderBy    : $scope.search.orderBy     ,
        currentCity: $scope.search.currentCity ,
        searchWord : $scope.search.searchWord||'',
        monthFrom  : monthBetween.from||'',
        monthTo    : monthBetween.to||'',
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
      $scope.searchResult = '';
      $scope.search = FacSearch.options;
      angular.extend(FacSearch.options, {
        //currentCity: "上海市杨浦区",
        //monthBetween: {from:'2017.12', to:'2018.3'},
        distSelect : $location.$$search.distSelect  ,
        level      : $location.$$search.level       ,
        orderBy    : $location.$$search.orderBy     ,
        searchWord : $location.$$search.searchWord  ,
        monthFrom  : $location.$$search.monthFrom   ,
        monthTo    : $location.$$search.monthTo     ,
      });
      if($location.$$search.currentCity){
        FacSearch.options.currentCity = $location.$$search.currentCity;
        FacSearch.options.lng = '';
        FacSearch.options.lat = '';
      }
      else if($location.$$search.lng){
        FacSearch.options.currentCity = '';
        FacSearch.options.lng = $location.$$search.lng;
        FacSearch.options.lat = $location.$$search.lat;
      }
      FacSearch.startSearch($location.$$search.searchType || FacSearch.searchType, 'dontReLocation').then(function(res){
        $scope.searchResult = res;
      });
    }

    else{
      $scope.searching = false;

      $scope.searchResult = [];
      $scope.search = FacSearch.options;
      angular.extend(FacSearch.options, {
        currentCity: FacSearch.options.currentCity || "上海市 上海城区 杨浦区",
        monthBetween: {from:'2017.12', to:'2018.3'},
        level: "all",
        orderBy: '按距离排序'
      });
    }
  }
})(window, angular);