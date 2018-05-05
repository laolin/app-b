
!(function (window, angular, undefined) {
  angular.module('dj-form').directive('flexRow', ['$q', function ($q) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        attr.$observe("flexRow", function (width) {
          element.addClass("flex flex-left");
          element.children().eq(0).addClass("shrink0");
          element.children().eq(1).addClass("flex-1");
          element.children()[0].style.opacity = 0.5;
          if (width) element.children()[0].style.width = width;
        });
      }
    };
  }])


})(window, angular);