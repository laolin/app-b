/**
 * 下拉刷新指令
 * ver: 0.0.1
 * build: 2018-01-03
 * power by LJH.
 *
 * 父指令(scroll-parent)，负责监听滚动事件，并发出广播
 *
 * 子指令(scroll-refresh)，负责接收广播，在收到广播时，响应
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('scrollParent', function(){
    return {
      restrict: 'A',
      link: scrollParent
    };
  })
  .directive('scrollRefresh', ['$parse', function($parse) {
    return function(scope, element, attr) {
      scrollRefresh($parse, scope, element, attr)
    }
  }])
  .directive('gotoTopMost', function() {
    return {
      restrict: 'EA',
      template: '<i class="fa fa-arrow-circle-up"></i>',
      link: gotoTopMost
    };
  });

  /**
   * 下拉刷新 - 父指令
   * @attr scroll-refresh: 每次滚动，均回调
   * @attr on-visible: 每次从不可见滚动到可见时，回调
   */
  function scrollParent(scope, element, attr) {
    //console.log("下拉刷新 - 父指令!");
    element[0].addEventListener('scroll', log, true);

    function log(event){
      /* 广播滚动事件 scrollParent */
      scope.$broadcast("scrollParent", event.srcElement.scrollTop)
      //console.log("下拉刷新 - 父指令滚动, top = ", event.srcElement.scrollTop)
    }
  };

  /**
   * 下拉刷新 - 子指令
   */
  function scrollRefresh($parse, scope, element, attr) {
    /**
     * 指令要用到的数据
     * isVisible 当前是否可见
     * clientHeight 屏幕窗口的高度
     */
    var isVisible = false;
    var clientHeight = document.body.clientHeight;

    /**
     * 获取事件回调函数
     * scroll-refresh: 每次滚动，均回调
     * on-visible: 每次从不可见滚动到可见时，回调
     */
    var handler = $parse(attr['scrollRefresh']);
    var onVisible = $parse(attr['onVisible']);
    //console.log("下拉刷新!");

    /**
     * 函数：获取上级元素的绝对 top 等数据
     * @return top: 上级元素的绝对 top 坐标
     * @return left: 上级元素的绝对 left 坐标
     * @return isTopMost: 上级元素已在最顶部了
     */
    function getParentTop(ele){
      if(!ele || !ele.length) return {
        top: 0,
        left: 0,
        isTopMost: true
      };
      var R = getParentTop(ele.parent());
      R.top -= ele[0].scrollTop || 0;
      R.left -= ele[0].scrollLeft || 0;
      R.isTopMost = R.isTopMost && (!ele[0].scrollTop && !ele[0].scrollLeft);
      //console.log(ele[0].offsetTop, ele[0].scrollTop, R.isTopMost);
      return R;
    }
    /**
     * 监听上级滚动事件 scrollParent
     */
    scope.$on("scrollParent", function(event, top) {
      //console.log("下拉刷新, 收到 top = ", top);
      //console.log("element = ", element);
      var oldVisible = isVisible;
      var parentData = getParentTop(element);
      //console.log("下拉刷新, 上级元素数据 = ", parentData);
      var myTop = element[0].offsetTop + parentData.top;
      isVisible = myTop < clientHeight;
      scope.$apply(function() {
        handler && handler(scope, {$element: element, $isTopMost: parentData.isTopMost, $top: myTop, $height: clientHeight});
        if(!oldVisible && isVisible){
          onVisible && onVisible(scope, {$element: element, $top: myTop, $isTopMost: parentData.isTopMost});
        }
      });
    });
  };

  /**
   * 回到顶部指令
   */
  function gotoTopMost(scope, element, attr) {
    element.css({
      position: 'fixed',
      right: '.10rem',
      bottom: '.65rem',
      color: '#333',
      'font-size': '.25rem',
      opacity: '0.6'
    });
    function parentGotoTopMost(ele){
      if(!ele || !ele.length) return;
      parentGotoTopMost(ele.parent());
      if(ele[0].scrollTop){
        ele[0].scrollTop = 0;
      }
    }
    element[0].addEventListener('click', function(){
      parentGotoTopMost(element);
    }, true);
  };

  


})(window, angular);