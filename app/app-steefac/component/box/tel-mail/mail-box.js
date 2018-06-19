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
    templateUrl: 'app-steefac/component/box/tel-mail/mail-box.template.html',
    bindings: {
      val: '<'
    },
    controller:['$scope', '$element', 'AppbData', ctrl]
  });


  function ctrl($scope, $element, AppbData) {
    $scope.appData = AppbData.getAppData();
    $element[0].addEventListener('click', () => {
      /* 记录用户点击 */
      $scope.$emit('require-log-user-action', {ac: '点击邮件', val: this.val});
    }, true);
  }
})(window, angular);