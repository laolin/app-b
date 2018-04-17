/**
 * 动态表单-ui下拉框组件
 * ver: 0.0.1
 * build: 2018-02-25
 * power by LJH.
 */
!(function (window, angular, undefined) {


  angular.module('dj-form').component('djFormItemDropdown', {
    bindings: {
      configs: '<',
      djDirty: '<',
      disabled: '<',
      djValid: '<',
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
        <div class="prompt error">{{$ctrl.djValid && ' ' || $ctrl.configs.valid.errorTip || '数据不合法'}}</div>
      </div>
      <uib-dropdown class="btn-group" is-open="open" on-toggle="onToggle(open)">
        <div class="flex flex-v-center" uib-dropdown-toggle ng-disabled="$ctrl.disabled">
          <span class="flex-w1" ng-show="!open || !searchMode">{{selected.title||selected||'　'}}</span>
          
          <dj-ui-input class="filter flex"
            ng-if="open && searchMode"
            ng-click="$event.stopPropagation()"
            focus="{{open && focusInput && 1 || ''}}"
            ng-model="searchText"
            ng-change="filter(value)"
          ></dj-ui-input>
          <span class="caret" ></span>
        </div>
        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
          <li class="{{item==selected && 'active' || ''}}"
            role="menuitem"
            ng-click="click(item)"
            ng-repeat="item in list track by $index"
          >{{item.title||item}}</li>
        </ul>
      </uib-dropdown>
    `,
    controller: ['$scope', '$timeout', '$http', '$q', 'DjWaiteReady', ctrl]
  });

  function ctrl($scope, $timeout, $http, $q, DjWaiteReady) {
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
  }
})(window, angular);