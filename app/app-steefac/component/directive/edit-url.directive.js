/**
 * 具有编辑提示的链接指令
 * ver: 0.0.1
 * build: 2018-01-10
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('editUrl', function(){
    return {
      restrict: 'A',
      transclude: true,
      template: '<ng-transclude></ng-transclude><i class="fa fa-edit" ng-if="editUrl"></i>',
      scope:{
        editUrl: '@'
      },
      link: function(scope, element, attr) {
        element.click(()=>{
          console.log(scope.editUrl);
          scope.editUrl && (location.href = scope.editUrl);
        });
        scope.$watch('editUrl', (vNew) => {
          element[vNew && 'addClass' || 'removeClass']('text-active');
        })
      }
    };
  });


})(window, angular);