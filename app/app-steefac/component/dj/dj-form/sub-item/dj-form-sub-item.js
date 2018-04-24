/**
 * 动态表单-所有子组件
 * ver: 0.1.0
 * build: 2018-04-26
 * power by LJH.
 */
!(function (window, angular, undefined) {

  var theModule = angular.module('dj-form');

  var theControlers = {
    /** 一般的 input 绑定 */
    "input": ['$scope', function($scope){
      this.$onChanges = (changes) => {
        if (changes.initValue) {
          $scope.value = this.initValue;
        }
      }
      $scope.change = (value) => {
        console.log("ng-change", value);
        this.onChange({ value });
      };
    }],

    /** 下拉框 */
    "dropdown": ["$scope", "$timeout", "$http", "$q", "DjWaiteReady", function($scope, $timeout, $http, $q, DjWaiteReady){
      var configReady = new DjWaiteReady();
      $scope.value = '';
      $scope.selected = '';
      $scope.onToggle = (open) => {
        $scope.focusInput = false;
        open && $timeout(() => {
          $scope.focusInput = true;
        }, 50)
      };
      $scope.click = (item) => {
        $scope.selected = item;
        this.onChange({ value: item.value || item });
      };
      $scope.filter = (searchText) => {
        if (!searchText) {
          $scope.list = $scope.list_full
        }
        else {
          var pattern = new RegExp(searchText.split('').join('\s*'), 'i');
          $scope.list = $scope.list_full.filter(item => {
            return pattern.test(item.value ? item.value + '-' + item.title : item);
          })
        }
      };

      this.$onChanges = (changes) => {
        if (changes.configs) {
          if (!this.configs || !this.configs.param) return;
          $scope.list = this.configs.param.list;
          console.log('原下拉列表, list: ', $scope.list);
          console.log('组件,', this.configs.name, ",", $scope.id);
          $scope.list_full = this.configs.param.list;
          $scope.searchMode = this.configs.param.searchMode;
          /** 通知配置已初始化 */
          initList(this.configs.param).then(list => {
            calcSelected();
            configReady.resolve(this.configs);
          });
        }
        if (changes.initValue) {
          $scope.value = this.initValue;
          configReady.ready(configs => {
            // 不重新获取
            initList(false).then(list => {
              calcSelected();
            });
          });
        }
      }

      /**
       * 初始化下拉列表
       * @param {*} param 要初始化列表的参数，false 表示用已有的数据(自己都忘了什么时候用false!)
       */
      var initList = (param) => {
        if (param === false && initList.result) {
          return $q.when(initList.result);
        }
        if (!$scope.list) return $q.when(initList.result = []);
        if (angular.isString(param.list)) {
          return $http.post('获取下拉列表', param.list).then(json => {
            return $q.when(initList.result = $scope.list = $scope.list_full = json.list);
          }).catch(e => {
            console.log('获取下拉列表, 失败: ', e);
            return initList.result = $q.reject($scope.list = $scope.list_full = []);
          })
        }
        if (angular.isFunction(param.list)) {
          return $q.when(initList.result = $scope.list = $scope.list_full = param.list());
        }
        return $q.when(initList.result = $scope.list = $scope.list_full = param.list);
      }

      /**
       * 根据 $scope.value 计算选中项
       * 要求：list 已初始化
       */
      var calcSelected = () => {
        if (!$scope.list) return;
        $scope.selected = $scope.list.find(item => (item.value || item) == $scope.value);
      }
    }],

    /** 单选框 */
    "radio": ["$scope", ($scope) => {
    }],

    /** 复选框 */
    "check-box": ["$scope", ($scope) => {
    }],

    /** 图片上传 */
    "imgs-uploader": ["$scope", ($scope) => {
    }],
  };
  var theTemplates = {

    /** 文本框 */
    "input": `
      <div class="flex prompt-top" dj-form-default-tip></div>
      <djui-input class="flex"
        param="$ctrl.configs.param"
        placeholder="{{$ctrl.configs.param.placeholder}}"
        init-value="$ctrl.initValue"
        on-change="$ctrl.onChange({value: value})"
      ></djui-input>`,

    /** 多行文本 */
    "textarea": `
      <div class="flex prompt-top" dj-form-default-tip></div>
      <textarea
        ng-model="value"
        ng-change="change(value)"
        placeholder="{{$ctrl.configs.param.placeholder}}"
      ></textarea>`,

    /** 下拉框 */
    "dropdown": `
      <div class="flex prompt-top" dj-form-default-tip></div>
      <select class="item-body" ng-model="value" ng-change="$ctrl.onChange({value:value})">
        <option value="">{{$ctrl.configs.param.placeholder}}</option>
        <option ng-repeat="item in list track by $index" value="{{$index}}">{{item.title||item}}</option>
      </select>
      `,

    /** 单选框 */
    "radio": `
      <div class="flex prompt-top" dj-form-default-tip></div>
    `,

    /** 复选框 */
    "check-box": `
      <div class="flex prompt-top" dj-form-default-tip></div>
    `,

    /** 星星 */
    "star": `
      <div class="flex prompt-top" dj-form-default-tip></div>
      <djui-star
        init-value="$ctrl.initValue"
        on-change="$ctrl.onChange({value: value})"
      ></djui-star>
    `,

    /** 图片上传 */
    "imgs-uploader": `
      <div class="flex prompt-top" dj-form-default-tip></div>
      <imgs-uploader class="padding-v-1"
        imgs="initValue"
        update-img="onChange(imgs)"
      ></imgs-uploader>`,
  };

  /** 默认模板注入，用于插座调用 */
  theModule.value("DjFormDefaultTemplate", theTemplates);


  var theComponentDefines = [
    { name: "input" },
    { name: "dropdown" },
    { name: "textarea", controller: "input" },
    { name: "radio" },
    { name: "star", controller: "input" },
    { name: "check-box" },
    { name: "imgs-uploader" },
  ];


  function directiveNormalize(name) {
    return name.replace(/[:\-_]+(.)/g, function (_, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }
  theComponentDefines.map(conponent => {
    theModule.component(directiveNormalize(`dj-form-default-item-${conponent.name}`), {
      bindings: {
        configs: '<',
        djDirty: '<',
        djValid: '<',
        invalidText: '<',
        djRequire: '<',
        initValue: '<',
        onChange: '&'
      },
      template: "",
      controller: theControlers[conponent.controller || conponent.name]
    });
  });
  theModule
  .directive(directiveNormalize('dj-form-default-tip'), function(){
    return {
      restrict: 'A',
      template: `
        <div class="flex title" dj-form-default-tip-mini></div>
        <div class="prompt error">{{$ctrl.djValid && ' ' || $ctrl.configs.valid.errorTip || '数据不合法'}}</div>
      `
    }
  })
  .directive(directiveNormalize('dj-form-default-tip-mini'), function(){
    return {
      restrict: 'A',
      template: `
        <div class="require">{{$ctrl.djRequire && '*' || ''}}</div>
        <div class="prompt-text">{{$ctrl.configs.title}}</div>
      `
    }
  });


})(window, angular);