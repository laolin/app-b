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
    controller:['$http','$log','$interval',
    function ($http,$log,$interval) {

    }]
  });
})(window, angular);