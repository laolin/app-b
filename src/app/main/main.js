!(function (window, angular, undefined) {

  if(!window.MD5)window.MD5 = function(str){
    var fn =  window.Md5 || window.md5;
    return fn(str).toUpperCase();
  }


  angular.module('my-app', ['frameApp', 'dj-app']);

  angular.bootstrap(document, ['my-app']);

})(window, angular);
