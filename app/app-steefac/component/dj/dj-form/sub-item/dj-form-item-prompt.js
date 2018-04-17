/**
 * 动态表单-显示框组件
 * ver: 0.0.1
 * build: 2018-02-25
 * power by LJH.
 */
!(function (window, angular, undefined) {


  angular.module('dj-form').component('djFormItemPrompt', {
    bindings: {
      configs: '<',
      initValue: '<'
    },
    template: `
      <div class="flex">
        <div class="flex-w2">{{$ctrl.configs.title}}</div>
        <div class="flex-w8">{{$ctrl.initValue}}</div>
      </div>
    `,
    controller: ['$scope', ctrl]
  });

  function ctrl($scope) {
    this.$onChanges = (changes) => {
    }
  }

})(window, angular);