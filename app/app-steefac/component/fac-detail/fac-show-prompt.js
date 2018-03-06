/**
 * 公司详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('facShowPrompt', ['$location', 'FacUser', function($location, FacUser){
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        ctrl(scope, element, attr, $location, FacUser);
      }
    };
  }]);

  function ctrl(scope, element, attr, $location, FacUser) {
    var fac, type;

    attr.$observe('facShowPrompt', function (val) {
      fac = scope[val];
    });
    attr.$observe('type', function (val) {
      type = val;
    });

    element.click( () => {
      FacUser.clickFac(fac, type);
    });
  }

})(window, angular);