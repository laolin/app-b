/**
 * 动态表单组件
 * ver: 0.1.0
 * build: 2018-04-26
 * power by LJH.
 * 
 * 上级向下级传递数据时，$onChanges将收到消息，处理
 *    保存到 memValue
 * 收到下级数据时，$onChanges不收到，不再下级传递以防递归，处理
 *    向再上级传递
 */
!(function (window, angular, undefined) {

  angular.module('dj-form')
    .component('djForm', {
      bindings: {
        configs: '<',
        initValues: '<',
        onFormValues: '&',
        onFormStatus: '&'
      },
      template: `
        <dj-form-item class="{{$ctrl.configs.css.form || 'flex-v rem-15 item-box'}} {{$ctrl.configs.css.item2}}"
          configs="subItem"
          init-values="memValue[subItem.name]"
          on-status-change="onItemStatusChange(item, valid, dirty)"
          on-value-change="onItemValueChange(item, value, valid, dirty)"
          ng-repeat="subItem in configItems track by $index"
        ></dj-form-item>`,
      controller: ['$scope', '$element', '$timeout', '$q', 'DjWaiteReady', ctrlForm]
    });
  function ctrlForm($scope, $element, $timeout, $q, DjWaiteReady) {
    var configReady = new DjWaiteReady();

    this.$onChanges = (changes) => {
      if (changes.initValues) {
        //console.log('上级通知值变化 djForm', changes.initValues);
        // 初始化整个表单的值，以确保下级上传时，表单值完整
        initValues(this.initValues);
      }
      if (changes.configs) initConfigs(changes.configs.currentValue);
    }

    /**
     * 数据初始化
     */
    $scope.memValue = {};
    function initValues(vNew) {
      $scope.memValue = {};
      if (typeof vNew === 'object') {
        /** 在配置初始化后，执行 */
        configReady.ready(configs => {
          for (var k in vNew) {
            // 在配置中有的名称，才初始化数据
            if (configs.items.find(item => item.name == k)) {
              $scope.memValue[k] = vNew[k];
            }
          }
        })
      }
    }


    /**
     * 初始化配置
     */
    function initConfigs(vNew) {
      itemValid = {};
      itemDirty = {};
      if (!vNew) return;
      var templates = vNew.templates || {};
      var pre = vNew.pre || 'dj-form-default-item-';
      var css = vNew.css || {};
      $scope.configItems = vNew.items.map(item => {
        return angular.extend({ pre, css, template: templates[item.type] }, item);
      });
      /** 通知配置已初始化 */
      vNew && configReady.resolve(vNew);
    };

    /**
     * 子组件事件接收
     */
    $scope.valid = true;
    $scope.dirty = false;
    var itemValid = {}; // 各子组件是否有效
    var itemDirty = {}; // 各子组件是否改变
    $scope.onItemStatusChange = (item, valid, dirty) => {
      itemValid[item.name] = valid;
      itemDirty[item.name] = dirty;
      $scope.valid = !Object.keys(itemValid).find(name => !itemValid[name]);
      $scope.dirty = !!Object.keys(itemDirty).find(name => itemDirty[name]);
      $timeout(notifyParentStatus);
    }

    /**
     * 全局状态监听和通知
     */
    var oldStatus = {}
    var notifyParentStatus = () => {
      if ($scope.valid === oldStatus.valid && $scope.dirty === oldStatus.dirty) return;
      oldStatus.valid = $scope.valid;
      oldStatus.dirty = $scope.dirty;
      /** 通知父组件: 表单状态改变 */
      this.onFormStatus && this.onFormStatus({
        valid: $scope.valid,
        dirty: $scope.dirty
      });
    }

    /**
     * 值改变事件接收
     */
    $scope.onItemValueChange = (item, value, valid, dirty) => {
      //console.log('收到值改变 djForm', item, value, valid, dirty);
      $scope.onItemStatusChange(item, valid, dirty)
      $scope.memValue[item.name] = value;
      /** 通知父组件: 表单数据改变 */
      this.onFormValues && this.onFormValues({
        value: $scope.memValue,
        valid: $scope.valid,
        dirty: $scope.dirty,
        item: item
      });
    };
  }


  /**
   * 子组件插座
   * 
   * 接收到上级通知值变化时，要通知下级
   * 接收到下级值时，
   */
  angular.module('dj-component')
    .component('djFormItem', {
      bindings: {
        configs: '<',
        initValues: '<',
        onValueChange: '&',
        onStatusChange: '&'
      },
      controller: ['$scope', '$element', '$timeout', '$q', '$compile', 'DjFormDefaultTemplate', ctrlFormItem]
    });
  function ctrlFormItem($scope, $element, $timeout, $q, $compile, DjFormDefaultTemplate) {

    /** 数据校验 */
    var theValid = $scope.theValid = {
      valid: true,
      require: false,
      tip: "", //错误提示

      configs: false,
      configReady: false,
      value: "", // 总是
      valueReady: false,
      setConfig: (configs) => {
        // console.log("数据校验, configs = ", configs);
        if (!configs) return;
        theValid.configs = configs;
        theValid.configReady = true;
        theValid.calc();
      },
      /** 复制数据到本对象，同时复制到$scope.initValue */
      setValue: (value) => {
        if (theValid.valueReady && angular.equals(theValid.value, value)) return false;
        theValid.valueReady = true;
        if (angular.isArray(value)) {
          theValid.value = angular.merge([], value);
          $scope.initValue = angular.merge([], value);
        }
        else if (angular.isObject(value)) {
          theValid.value = angular.merge({}, value);
          $scope.initValue = angular.merge({}, value);
        }
        else {
          theValid.value = value;
          $scope.initValue = value;
        }
        theValid.calc();
        return true;
      },
      /** 计算，验证数据是否有效，同时，设置提示文本 */
      calc: () => {
        if (!theValid.configReady || !theValid.valueReady) return;
        var valid = theValid.configs.param && theValid.configs.param.valid
          || theValid.configs.valid || {};

        var invalid = angular.extend({ required: "不可为空" }, theValid.configs.invalid);

        if (valid.minLength) valid.minlength = valid.minlength || valid.minLength; // 允许名字兼容
        if (valid.maxLength) valid.maxlength = valid.maxlength || valid.maxLength; // 允许名字兼容

        /** 先假定数据有效，然后再验证 */
        theValid.valid = true;
        theValid.tip = "";
        theValid.require = valid.require;
        /** 开始验证 */
        if (valid.require) {
          if (!theValid.value && theValid.value !== 0) {
            theValid.valid = false;
            theValid.tip = invalid.required || valid.errorTip || "";
            return;
          }
        }
        if (valid.pattern) {
          if (!valid.pattern instanceof RegExp) {
            valid.pattern = new RegExp(valid.pattern);
          }
          if (!valid.pattern.test(theValid.value)) {
            theValid.valid = false;
            theValid.tip = invalid.pattern || valid.errorTip || "";
            return;
          }
        }
        if (valid.max) {
          var not_number = typeof (theValid.value) == "object" || Number.isNaN(Number(theValid.value));
          var error = not_number || +theValid.value > valid.max;
          if (error) {
            theValid.valid = false;
            theValid.tip = (not_number ? invalid.number : invalid.max) || valid.errorTip || "";
            return;
          }
        }
        if (valid.min) {
          var not_number = typeof (theValid.value) == "object" || Number.isNaN(Number(theValid.value));
          var error = not_number || +theValid.value < valid.min;
          if (error) {
            theValid.valid = false;
            theValid.tip = (not_number ? invalid.number : invalid.min) || valid.errorTip || "";
            return;
          }
        }
        if (valid.maxlength) {
          var v = theValid.value || '';
          var error = !v.hasOwnProperty('length') || v.length > valid.maxlength;
          if (error) {
            theValid.valid = false;
            theValid.tip = invalid.maxlength || valid.errorTip || "";
            return;
          }
        }
        if (valid.minlength) {
          var v = theValid.value || '';
          var error = !v.hasOwnProperty('length') || v.length < valid.minlength;
          if (error) {
            theValid.valid = false;
            theValid.tip = invalid.minlength || valid.errorTip || "";
            return;
          }
        }
      },
    };

    this.$onChanges = (changes) => {
      if (changes.initValues) {
        theValid.setValue(changes.initValues.currentValue);
        $scope.valid = '----';
        syncStatus(false).then(emitStatus);
      }
      if (changes.configs) {
        compileConfigs(changes.configs.currentValue);
        theValid.setConfig(changes.configs.currentValue);
        $scope.valid = '----';
        syncStatus(false).then(emitStatus);
      }
    }
    this.$onInit = () => {
      //syncStatus(false).then(emitStatus);
    }

    /** 编译生成动态子表单项 */
    function compileConfigs(configs) {
      if (!configs) {
        $element.html("");
        return;
      }
      var eleName = configs.pre + (configs.type || 'input');
      var template = `
        <${eleName}
          class="{{$ctrl.configs.css.item||''}} {{dirty&&'ng-dirty'||''}} {{!theValid.valid&&'ng-invalid'||''}}"
          configs="$ctrl.configs"
          init-value="initValue"
          on-change="onChange(value)"
          invalid-text="theValid.tip"
          dj-require="theValid.require"
          dj-valid="theValid.valid"
          dj-dirty="theValid.dirty"
        ></${eleName}>
      `;
      var childElement = $compile(template)($scope);
      $element.append(childElement[0]);
      var childScope = $scope.$$childHead;
      var childContent = $compile(configs.template || DjFormDefaultTemplate[configs.type])(childScope);
      childElement.html(childContent);



      return;

      //console.log('validText = ', validText);
      $element.html(`
        <${eleName}
          class="{{dirty&&'ng-dirty'||''}} {{!theValid.valid&&'ng-invalid'||''}}"
          configs="$ctrl.configs"
          init-value="initValue"
          on-change="onChange(value)"
          invalid-text="theValid.tip"
          dj-require="theValid.require"
          dj-valid="theValid.valid"
          dj-dirty="theValid.dirty"
        ></${eleName}>`);
      $compile($element.contents())($scope);
      console.log('插座,', configs.name, ",", $scope.id);
      var childElement = $element.children();
      var childScope = $scope.$$childHead;
      childElement.html(configs.template || DjFormDefaultTemplate[configs.type])
      $compile(childElement.contents())(childScope);
    };

    /** 状态，及其初始化 */
    $scope.valid = true;
    $scope.dirty = false;
    $scope.invalidText = "";
    var getInvalidText = (ele) => {
      var param = angular.extend({ required: "不可为空" }, this.configs.invalid);
      for (var name in { required: 1, minlength: 1, maxlength: 1 }) {
        if (param[name] !== undefined && ele.hasClass('ng-invalid-' + name)) {
          //console.log('valid, name = ', name, param, this.configs)
          return param[name];
        }
      };
      //console.log('valid = ', this.configs.valid, "return:", this.configs.valid && this.configs.valid.errorTip || '')
      return this.configs.valid && this.configs.valid.errorTip || '';
    }
    function syncStatus(dirty) {
      return $timeout(() => {
        var ele = $element.children();
        var valid = theValid.valid;
        if (valid === $scope.valid && dirty === $scope.dirty) {
          return $q.reject('状态未改变');
        }
        $scope.valid = valid;
        $scope.dirty = dirty;
        //console.log('状态改变 valid=', valid, ', dirty=', dirty)
        return $q.resolve({ valid, dirty });
      });
    }
    var emitStatus = (status) => {
      this.onStatusChange && this.onStatusChange({
        item: this.configs,
        valid: status.valid,
        dirty: status.dirty,
      });
    }

    /** 下级值改变事件 */
    $scope.onChange = (value) => {
      if (!theValid.setValue(value)) {
        //console.log('下级值事件，值未变 插座', value);
        return;
      }
      //console.log('收到值改变 插座', value);
      syncStatus(true).then(emitStatus)
        .finally(() => {
          this.onValueChange({
            item: this.configs,
            value: value,
            valid: $scope.valid,
            dirty: $scope.dirty
          });
        });
    }
  }
})(window, angular);