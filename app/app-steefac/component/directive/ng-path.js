/**
 * 具有编辑提示的链接指令
 * ver: 0.0.1
 * build: 2018-01-10
 * power by LJH.
 */
!(function (window, angular, undefined) {
  'use strict';

  angular.module('steefac')
    .directive('ngPath', ['$location', function ($location) {
      return {
        restrict: 'AE',
        link: function (scope, element, attr) {
          var path, search = {}, replace = false;
          attr.$observe("ngPath", function (value) {
            path = value;
            setHref();
          });
          attr.$observe("search", function (value) {
            eval('search=' + (value||0));
            search = search || {};
            setHref();
          });
          function setHref(){
            var hash = "#!" +  path;
            var searchString = ((search) =>{
              var arr = [];
              for(var k in search){
                arr.push(k + '=' + encodeURIComponent(search[k]))
              }
              return arr.join('&');
            })(search);
            if(searchString) hash = hash + '?' + searchString;
            element.attr('href', hash)
          }
        }
      };
    }]);

})(window, angular);