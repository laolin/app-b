/**
 * 拨打电话组件
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('telBox',{
    templateUrl: 'app-steefac/component/box/tel-mail/tel-box.template.html',
    bindings: {
      val: '<'
    },
    controller:['$scope', '$element', 'AppbData', 'FacUser', ctrl]
  });


  function ctrl($scope, $element, AppbData, FacUser) {
    $scope.appData = AppbData.getAppData();
    $element[0].addEventListener('click', () => {
      /* 记录用户点击 */
      $scope.$emit('require-log-user-action', {ac: '点击电话', val: this.val});
    }, true);
  }
})(window, angular);