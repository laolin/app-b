/**
 * 动态表单显示组件
 * ver: 0.1.0
 * build: 2018-04-30
 * power by LJH.
 */
!(function (window, angular, undefined) {

  /**
   * 表单显示组件
   *
   * 首次 configs 和 values 数据到来时，编译
   * 以后，configs 变化时，重新编译; values 变化时，仅传递数据
   */
  angular.module('dj-form').component('djFormShow', {
    bindings: {
      configs: '<',
      initValues: '<',
    },
    template: `
      <dj-form-show-item class="{{configs.css.form || 'flex-v rem-15 item-box'}} {{configs.css.item2}}"
        configs="subItem"
        init-value="values[subItem.name]"
        ng-repeat="subItem in configItems track by $index"
        ng-if="configs"
      ></dj-form-show-item>`,
    controller: ['$scope', function ($scope) {
      this.$onChanges = (changes) => {
        if (changes.configs) $scope.configs = changes.configs.currentValue;
        if (changes.initValues) $scope.values = changes.initValues.currentValue;
        initConfigs($scope.configs, $scope.values);
      }
      /**
       * 初始化配置
       * 首次 configs 和 values 数据到来时，编译
       * 以后，configs 变化时，重新编译; values 变化时，仅传递数据
       */
      function initConfigs(configs, values) {
        if (!configs || !values) return;
        var templates = configs.templates || {};
        var pre = configs.pre || 'dj-form-default-item-';
        var css = configs.css || {};
        $scope.configItems = configs.items.map(item => {
          return angular.extend({ pre, css, template: templates[item.type + "-show"] }, item);
        });
      };
    }]
  });

  /**
   * 子组件插座
   */
  angular.module('dj-component').component('djFormShowItem', {
    bindings: {
      configs: '<',
      initValue: '<',
    },
    controller: ['$scope', '$element', '$timeout', '$q', '$compile', 'DjFormDefaultDefine', ctrlFormItem]
  });
  function ctrlFormItem($scope, $element, $timeout, $q, $compile, DjFormDefaultDefine) {

    this.$onChanges = (changes) => {
      if (changes.configs) $scope.configs = changes.configs.currentValue;
      if (changes.initValue) $scope.value = changes.initValue.currentValue;
      compileConfigs($scope.configs, $scope.value);
    }

    /** 编译生成动态子表单项 */
    function compileConfigs(configs, value) {
      if (!configs) {
        $element.html("");
        return;
      }
      /** 一些自动隐藏 */
      if(configs.show){
        if(configs.show.autohide == 'empty' && value!==0 && !value){
          $element.html("");
          return;
        }
        if(configs.show.autohide == 'zero length' && !(value && value.length)){
          $element.html("");
          return;
        }
      }

      /** 开始编译子组件 */
      var eleType = configs.type || 'input';
      var eleName = configs.pre + eleType;
      var template = `
        <${eleName}-show
          class="{{$ctrl.configs.css.item||''}}"
          configs="$ctrl.configs"
          init-value="$ctrl.initValue"
        ></${eleName}-show>
      `;
      var childElement = $compile(template)($scope);
      $element.append(childElement[0]);
      var childScope = $scope.$$childHead;
      var childTemplate = configs.template || DjFormDefaultDefine.getTemplateShow(eleType);
      var childContent = $compile(childTemplate)(childScope);
      childElement.html(childContent);
    };



  }
})(window, angular);