/**
 * 动态表单-下拉框组件
 * ver: 0.0.1
 * build: 2018-02-25
 * power by LJH.
 */
!(function (window, angular, undefined) {


  angular.module('dj-form')
    .component('djFormItemSelect', {
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
          <div class="prompt error">{{
            $ctrl.invalidText ||
            $ctrl.djValid && ' ' || 
            $ctrl.configs.valid.errorTip || '数据不合法'
          }}</div>
        </div>
        <select  ng-model="$ctrl.initValue" ng-change="$ctrl.onChange({value: $ctrl.initValue})">
          <option value="{{item.value||item}}" ng-repeat="item in $ctrl.configs.param.list">{{item.text||item}}</option>
        </select>
        `,
      controller: ['$scope', ctrl]
    });

  function ctrl($scope) {
    this.$onChanges = (changes) => {
      //if(changes.initValue)console.log('上级通知值变化 input', changes);
    }
  }
})(window, angular);