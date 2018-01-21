/**
 * 推送消息组件
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('sendtplBox',{
    template: `
      <div class="flex flex-v-center tel-mal-box" ng-if="$ctrl.adminInfo.me">
        <i class="fa fa-paper-plane box-primary"></i>
        <span class="text-active">推送到50个项目</span>
      </a>`,
    bindings: {
      type: '<',
      adminInfo: '<',
      fac: '<'
    },
    controller:['$scope', '$element', 'AppbData', ctrl]
  });


  function ctrl($scope, $element, AppbData) {
    this.$onChanges = (chg) => {
    }
  }
})(window, angular);