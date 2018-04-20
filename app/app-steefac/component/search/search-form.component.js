/**
 * 搜索表单组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('searchForm',{
    templateUrl: 'app-steefac/component/search/search-form.template.html',
    bindings: {
      searchData: '='
    },
    controller:['$scope', 'AmapMainData', 'AppbData', 'FacSearch', function ($scope, AmapMainData, AppbData, FacSearch) {
      var ctrl = this;
      $scope.appData = AppbData.getAppData();
      $scope.FacSearch = FacSearch;
      $scope.getMyCity = function(){
        AmapMainData.china.getLocalCity().then( (city) =>{
          city = city || {province: "上海市"};
          city.province = city.province || "上海市";
          ctrl.searchData.currentCity = city.province + ' ' + (city.city||"");
        });
      }
    }]
  });
})(window, angular);