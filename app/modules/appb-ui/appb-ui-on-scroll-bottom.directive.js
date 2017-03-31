'use strict';
(function(){

angular.module('appb')
.directive('appbUiOnScrollBottom', function () {
  return {
    restrict: 'A',
    //template: 'Load more...',
    link: function (scope, element, attrs) {
      var raw = element[0];
      
      //console.log('appbUiOnScrollBottom link',scope, element, attrs,raw.scrollTop , raw.offsetHeight,raw.scrollHeight,'ok..');
          
      element.bind('scroll', function () {
        //console.log('in scroll');
        //console.log(raw.scrollTop , raw.offsetHeight,raw.scrollTop + raw.offsetHeight);
        //console.log(raw.scrollHeight);
        if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
          //console.log("I am at the bottom");
          scope.$apply(attrs.appbUiOnScrollBottom);
        }
      });
    }
  };
});

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
