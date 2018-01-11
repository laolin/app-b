/**
 * 各种CSS组件
 * ver: 0.0.1
 * build: 2017-12-30
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  function simpleStyle(name, fn){
    angular.module('steefac')
    .directive(name, function(){
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          attr.$observe(name, function (val) {
            fn(val, element, attr);
          });
        }
      };
    });
  }

  /**
   * 颜色
   */
  simpleStyle('c', function(val, element, attr) {
    if(("" + val).length == 2) val = "" + val + val + val;
    element[0].style['color'] = "#" + val;
  });

  /**
   * 背景颜色
   */
  simpleStyle('bk', function(val, element, attr) {
    if(("" + val).length == 2) val = "" + val + val + val;
    element[0].style['background-color'] = "#" + val;
  });

  /**
   * padding
   */
  simpleStyle('padding', function(val, element, attr) {
    if(!("" + val))return;
    element[0].style['padding'] = val;
  });

  /**
   * 后随箭头
   */
  simpleStyle('next', function(val, element, attr) {
    var style = 'opacity: 0.5;font-size:1.6em';
    element.append('<i class="fa fa-angle-' + (val||'right') + '" style="'+style+'"></i>');
  });

  /**
   * 前置图标
   */
  simpleStyle('prevfa', function(val, element, attr) {
    element.before('<i class="fa fa-' + (val||'star') + '"></i>');
  });



})(window, angular);