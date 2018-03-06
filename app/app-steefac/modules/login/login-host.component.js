!(function (window, angular, undefined) {

  var idWxLoginDiv = 'wx-lg_cnt_' + (+new Date());
  var isWx = (/micromessenger/i).test(navigator.userAgent);

  angular.module('dj-login')
    .component('loginHost', {
      template: ``,
      bindings: {
        mode: '<',
        pageTo: '<'
      },
      controller: ['$scope', '$element', '$compile', ctrl]
    });

  function ctrl($scope, $element, $compile) {
    this.$onInit = (a, b, c) => {
      console.log("登录插座: pageTo=", this.pageTo);
      var eleName = 'login-' + this.mode;
      $element.html(`<${eleName} page-to="$ctrl.pageTo"></${eleName}>`);
      $compile($element.contents())($scope);
    }


  }

})(window, angular);
