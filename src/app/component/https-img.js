!(function (window, angular, undefined) {

  function httpsImg(value) {
    if(value.indexOf('http://thirdwx.qlogo.cn/') ==0){
      return 'https' + value.substr(4);
    }
    return value;
  }

  console.log('httpsImg');
  angular.module('dj-component').directive('httpsImg',  function ($location) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        attr.$observe("httpsImg", function (value) {
          element.attr('src', httpsImg(value));
        });
      }
    };
  });

})(window, angular);