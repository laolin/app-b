/**
 * 搜索页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';
  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/search', {
        pageTitle: "搜索",
        wxShare:{
        },
        templateUrl: 'app-steefac/view/search/search.view.template.html',
        controller: ['$scope', '$routeParams', '$location','AppbData', ctrlSearch]
      })
      .when('/searching', {
        pageTitle: "搜索结果",
        wxShare:{
        },
        templateUrl: 'app-steefac/view/search/searching.view.template.html',
        controller: ['$scope','$log','$routeParams','$q','$location','AppbData','FacSearch', 'FacMap', 'AmapMainData',ctrlSearching]
      });
  }]);


  /**
   * 保存两个页面的状态
   */
  var pageState = {
    search: {},
    searching: {},
    hideMap: false
  };


  function ctrlSearch($scope, $routeParams, $location, AppbData) {
    console.log('搜索页面');
    var userData = AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }
    $scope.appData = AppbData.getAppData();
    
    $scope.$on('$routeChangeSuccess', function(evt, current, prev) {
      //console.log('搜索:页面成功');
      if(prev && current.$$route.originalPath == '/search'){
        if(prev.$$route.originalPath == '/searching'){
          //console.log('搜索:清除页面状态');
          pageState.searching = {};
        }
        else if(pageState.searching.searchType){
          //console.log('搜索:恢复页面状态');
          $location.path('/searching').search(pageState.searching).replace();
        }
      }
    })

    /**
     * 搜索
     */
    $scope.search = function(searchType){
      var monthBetween = $scope.search.monthBetween || {};
      var param = {
        searchType : searchType,
        distSelect : $scope.searchData.distSelect,
        level      : $scope.searchData.level       ,
        currentCity: $scope.searchData.currentCity ,
        searchWord : $scope.searchData.searchWord||'',
        monthFrom  : monthBetween.from||'',
        monthTo    : monthBetween.to||'',
      }
      $location.path('/searching').search(param);
    }

    $scope.searchData = pageState.search;
    angular.extend($scope.searchData, {
      currentCity : $scope.searchData.currentCity || "上海市 上海市",
      distSelect  : $scope.searchData.distSelect || '0',
      monthBetween: $scope.searchData.monthBetween || {}
    });
  }


  function ctrlSearching($scope,$log, $routeParams,$q,$location,AppbData,FacSearch, FacMap, AmapMainData) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/search'});;
    }

    $scope.$on('$routeChangeStart', function(evt, next, current) {
      //console.log('搜索:保存页面状态');
      pageState.searching = $scope.search;
    });

    $scope.appData = AppbData.getAppData();

    $scope.FacSearch = FacSearch;
    var type = $scope.type = $location.$$search.searchType || 'steefac';

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
    function getSearchParam(options, position){
      var param = {
        searchType : $scope.type,
        distSelect : options.distSelect || 0,
        level      : options.level || 'all',
        orderBy    : options.orderBy || '按更新排序',
      };
      if(options.searchWord) param.searchWord = options.searchWord;
      if(options.monthFrom ) param.monthFrom  = options.monthFrom ;
      if(options.monthTo   ) param.monthTo    = options.monthTo   ;
      if(position){
        paramSearchCityOrLngLat(param, position);
      }
      return param;
    }
    $scope.hideMap = pageState.hideMap;
    $scope.toggleHideMap = function(){
      $scope.hideMap = pageState.hideMap = !$scope.hideMap;
    }
    $scope.research = function(){
      var param = getSearchParam($scope.search, $location.$$search);
      $location.replace('/searching').search(param);
    }

    $scope.search = getSearchParam($location.$$search, $location.$$search);
    $scope.searchResult = false;
    $scope.$on('search-result-page-change', (event, list) => {
      console.log('页面改变, list = ', list);
      // 只显示这一页数据到地图上
      FacSearch.markObjList(list, type)
      .then(()=>{
        // 显示前 insideCount  个标志
        $q.when(AmapMainData.onAmap, (amap)=> {
          window.amap = amap; // 调试用！！！
          amap.setFitView(FacMap.searchMarkers);
        });
      });
    });
    FacSearch.search($scope.search, type)
    .then(function(json){
      if($scope.search.level != 'all'){
        json.list = json.list.filter( item => {
          return item.level == $scope.search.level;
        });
      }
      $scope.searchResult = json.list;
      sortBy[$scope.search.orderBy] && $scope.searchResult.sort(sortBy[$scope.search.orderBy]);
    });
    $scope.$on('AMap.OnClick', (event, msg) => {
      console.log('地图点击, lng = ', msg.lnglat.lng);
    });


    var sortBy = {
      '按产能排序': function (a, b) { return +a.cap_6m > +b.cap_6m ? -1 : 1;},
      '按需求排序': function (a, b) { return +a.need_steel > +b.need_steel ? -1 : 1;},
      '按更新排序': function (a, b) { return a.update_at > b.update_at ? -1 : 1;},
      '按距离排序': function (a, b) { return a.distance > b.distance ? 1 : -1;}
    }
  }


})(window, angular);