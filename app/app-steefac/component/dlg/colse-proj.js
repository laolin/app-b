
!(function (window, angular, undefined) {
  angular.module('steefac').component('dlgCloseProj', {
    template: `
    <djui-dialog param="dlgParam">
      <djui-dialog-body>
        <dj-form class="my-form" ng-if="$ctrl.close=='close'"
          configs="configs"
          on-form-values="formValueChange(value, item, valid, dirty)"
          on-form-status="formStatusChange(item, valid, dirty)"
        ></dj-form>
        <div ng-if="$ctrl.close=='open'">
          重新开放本项目？
        </div>
      </djui-dialog-body>
    </djui-dialog>
      `,
    bindings: {
      fac: '<',
      close: '<',
      backClose: '<',
    },
    controller: ['$scope', '$http', '$q', ctrl]
  });

  function ctrl($scope, $http, $q) {
    var mode_list = [
      { value: "pause", title: "暂停项目" },
      { value: "deal", title: "成交关闭" },
    ];
    var mode = { name: 'mode', title: '关闭方式', type: 'dropdown', param: { valid: { require: true }, invalid: { required: "请选择" }, list: mode_list, placeholder: "关闭方式" } };
    var theForm = {
      pause: [
        mode,
        { name: 'remark', title: '暂停原因', type: 'textarea', param: { valid: { require: true }, placeholder: "暂停原因" } },
      ],
      deal: [
        mode,
        { name: 'proj', title: '成交项目', type: 'input', param: { valid: { require: true }, placeholder: "成交项目" } },
      ],
      error: [
        mode,
      ],
    }
    $scope.configs = {
      items: theForm.error,
    };
    $scope.dlgParam = {
      beforeClose: (btnName) => {
        if (btnName != "OK") return true;
        if (!theData.valid && this.close != "open") return false;
        var post_data = { type: "steeproj", facid: this.fac.id, close: this.close };
        if(this.close == "close"){
          post_data.data = theData.value;
        }
        return $http.post("sa_data/close_fac", post_data);
      },
      backClose: this.backClose,
    };
    this.$onChanges = (changes) => {
      if (changes.backClose) {
        $scope.dlgParam.backClose = !!changes.backClose.currentValue;
      }
    }

    /** 表单数据 */
    var theData = {
      valid: false,
      value: {},
    }
    $scope.formValueChange = (value, item, valid, dirty) => {
      theData.valid = valid;
      theData.value = value;
      if (item.name == 'mode') {
        $scope.configs = angular.extend({}, $scope.configs, { items: theForm[value.mode || "error"] });
      }
    };
    $scope.formStatusChange = (item, valid, dirty) => {
      theData.valid = valid;
    };
  }
})(window, angular);