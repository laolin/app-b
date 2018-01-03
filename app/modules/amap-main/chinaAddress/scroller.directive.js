/**
 * 滚动指令
 */
!(function(window, angular) {'use strict';

var myScroll = angular.module('amap-main');

myScroll.directive('myScroll', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var
      scrollTop = 0,
      handler = $parse(attr['myScroll']);
    element[0].addEventListener('scroll', onScroll, true);
    function onScroll(event){
      scrollTop = event.srcElement.scrollTop;
      scope.$apply(function() {
        handler(scope, {$event: event, $pos: scrollTop});
      });
    }
    scope.$watch(
      function(scope) {
        // watch the 'myScrollTop' expression for changes
        return scope.$eval(attr.myScrollTop);
      },
      function(vNew) {
        vNew = +vNew || 0;
        element[0].scrollTop = vNew;
      }
    );
  }
}]);



})(window, window.angular);
