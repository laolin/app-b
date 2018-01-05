/**
 * 发送邮件组件
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('mailBox',{
    templateUrl: 'app-steefac/component/tel-mail/mail-box.template.html',
    bindings: {
      val: '<'
    },
    controller:['$scope', '$element', 'AppbData', ctrl]
  });


  function ctrl($scope, $element, AppbData) {
    $scope.appData = AppbData.getAppData();
    //$scope.click = () => {
    //  console.log(this.val);
    //}
  }
})(window, angular);