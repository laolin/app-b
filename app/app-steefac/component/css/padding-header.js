/**
 * 根据是否有标题栏，确定绝对定位的顶部偏移
 * ver: 0.0.1
 * build: 2018-01-27
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('paddingHeader',['AppbData', function(AppbData){
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var headerData = AppbData.getHeaderData();
        if(!headerData.hide){
          element[0].style['top'] = '44px';
        }
      }
    };
  }])

})(window, angular);