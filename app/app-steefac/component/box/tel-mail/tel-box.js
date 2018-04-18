/**
 * 拨打电话组件
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined) {
  'use strict';

  angular.module('steefac')
    .component('telBox', {
      template: `
        <a ng-href="{{$ctrl.val && $ctrl.val!='yes' && ('tel://'+$ctrl.val) || ''}}" class="flex flex-v-center tel-mal-box {{!$ctrl.val&&'disabled'||''}}">
          <img ng-src="{{SiteConfig.assetsRoot}}/img/img-steefac/tel.png">
          <span>{{$ctrl.val=='yes' && '查看号码' || $ctrl.val|| '尚未提供' }}</span>
        </a>
      `,
      bindings: {
        val: '<',
        click: "&"
      },
      controller: ['$scope', '$element', 'SiteConfig', '$http', '$q', ctrl]
    });


  function ctrl($scope, $element, SiteConfig, $http, $q) {
    $scope.SiteConfig = SiteConfig;
    var defaultClick = () => {
      /* 记录用户点击 */
      $scope.$emit('require-log-user-action', { ac: '点击电话', val: this.val });
    }
    $element[0].addEventListener('click', () => {
      var result = this.click({ val: this.val });
      if (result) {
        $q.when(result).then(defaultClick);
      } else {
        defaultClick();
      }
    }, true);
  }
})(window, angular);