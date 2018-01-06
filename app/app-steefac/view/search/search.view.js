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
    controller: ['$scope','$routeParams','$q','$location','AppbData','FacSearch', 'FacMap', 'AmapMainData',ctrl]
  }
  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/search', config)
      .when('/search/:ac', config);
  }]);

  function ctrl($scope, $routeParams,$q,$location,AppbData,FacSearch, FacMap, AmapMainData) {
    appData.setPageTitle('搜索');

    $scope.appData = AppbData.getAppData();

    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }
    $scope.FacSearch = FacSearch;

    function paramSearchCityOrLngLat(param, data){
      if(data.currentCity){
        param.currentCity = data.currentCity;
        delete param.lng;
        delete param.lat;
      }
      else if(data.lng){
        delete param.currentCity;
        param.lng = data.lng;
        param.lat = data.lat;
      }
    }
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
      };
      if($routeParams.ac == 'searching'){
        paramSearchCityOrLngLat(param, $location.$$search);
      }
      else{
        angular.extend(param, {
          currentCity: $scope.search.currentCity ,
          searchWord : $scope.search.searchWord||'',
          monthFrom  : monthBetween.from||'',
          monthTo    : monthBetween.to||'',
        });
      }
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
      $scope.search = angular.extend({}, FacSearch.options);
      angular.extend($scope.search, {
        distSelect : "" + $location.$$search.distSelect || "0", // 数字，下拉框居然不认！
        level      : $location.$$search.level      || 'all',
        orderBy    : $location.$$search.orderBy    || '按距离排序' ,
        searchWord : $location.$$search.searchWord  ,
        monthFrom  : $location.$$search.monthFrom   ,
        monthTo    : $location.$$search.monthTo     ,
      });
      paramSearchCityOrLngLat($scope.search, $location.$$search);
      var type = $scope.type = $location.$$search.searchType || FacSearch.searchType;
      FacSearch.search($scope.search, type)
      .then(function(json){
        setSearchResult(json.list, json.pos, 3);
      });
      $scope.$on('AMap.OnClick', (event, msg) => {
        console.log('地图点击, lng = ', msg.lnglat.lng);
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

    function setSearchResult(list, pos, insideCount){
      insideCount = insideCount || 5;
      $scope.searchResult = list;
      $scope.searchResult.sort( (a, b) => {
        return a.distance > b.distance ? 1 : -1;
      });
      // 全部标志, 但地图放大到最大，等下再缩小
      FacSearch.markObjList($scope.searchResult, type)
      .then(()=>{
        // 显示前 insideCount  个标志
        $q.when(AmapMainData.onAmap, (amap)=> {
          window.amap = amap; // 调试用！！！
          var insideMarkers = FacMap.searchMarkers.slice(0, insideCount);
          amap.setFitView(insideMarkers);
        });
      });
    }
  }
})(window, angular);