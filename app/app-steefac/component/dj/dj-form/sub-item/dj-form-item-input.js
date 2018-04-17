/**
 * 动态表单-文本框组件
 * ver: 0.0.1
 * build: 2018-02-25
 * power by LJH.
 */
!(function (window, angular, undefined) {


  angular.module('dj-form')
    .component('djFormItemInput', {
      bindings: {
        configs: '<',
        djDirty: '<',
        djValid: '<',
        invalidText: '<',
        djRequire: '<',
        initValue: '<',
        onChange: '&'
      },
      template: `
          <div class="flex prompt-top">
            <div class="flex title">
              <div class="require">{{$ctrl.djRequire && '*' || ''}}</div>
              <div class="">{{$ctrl.configs.title}}</div>
            </div>
            <div class="prompt error" ng-if="!$ctrl.djValid">{{$ctrl.invalidText || '请正确填写'}}</div>
          </div>
          <dj-ui-input class="flex"
            param="$ctrl.configs.param"
            init-value="$ctrl.initValue"
            on-change="$ctrl.onChange({value: value})"
          ></dj-ui-input>
        `,
      controller: ['$scope', ctrl]
    });

  function ctrl($scope) {
    this.$onChanges = (changes) => {
      //if(changes.initValue)console.log('上级通知值变化 input', changes);
    }
  }
})(window, angular);