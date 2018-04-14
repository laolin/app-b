
!(function (window, angular, undefined) {
  angular.module('steefac').component('dlgContactTelPrompt', {
    template: `
      <dj-dialog dialog-show="showing" on-click-back="onClickBack()" on-close="onClose($name)">
        <dj-dialog-title>
          工作人员电话联系记录
        </dj-dialog-title>
        <dj-dialog-body>
          <br>
          <div class="flex" ng-if="!list.length">
            <div class="">
              最近联系：尚无
            </div>
            <a href="tel://{{fac.contact_tel}}" class="flex flex-v-center flex-left tel-mal-box {{!fac.contact_tel&&'disabled'}}">
              <img ng-src="{{SiteConfig.assetsRoot}}/img/img-steefac/tel.png">
              <span>拨打电话</span>
            </a>
          </div>
          <div class="flex-v" ng-if="list.length">
            <div class="text-left text-5">最近联系({{list.length}}):</div>
            <div class="text-left" ng-repeat="item in list">
              [{{item.time|substr:0:16}}] uid: {{item.v2}}
            </div>
            <br>
            <a href="tel://{{fac.contact_tel}}" class="flex flex-v-center flex-left tel-mal-box {{!fac.contact_tel&&'disabled'}}">
              <img ng-src="{{SiteConfig.assetsRoot}}/img/img-steefac/tel.png">
              <span>拨打电话</span>
            </a>
          </div>
        </dj-dialog-body>
        <dj-dialog-footer class="weui-dialog__ft">
          <span class="weui-dialog__btn weui-dialog__btn_default"
            ng-if="!hideCancel"
            ng-click="cancel()">我不联系了</span>
          <span class="weui-dialog__btn weui-dialog__btn_primary"
            ng-if="!hideOk"
            ng-click="OK()">我联系好了</span>
        </dj-dialog-footer>
      </dj-dialog>
      `,
    bindings: {
      fac: '<',
      type: '<',
      user: '<',
    },
    controller: ['$scope', '$http', '$q', 'SiteConfig', ctrl]
  });

  function ctrl($scope, $http, $q, SiteConfig) {
    $scope.showing = true;
    $scope.SiteConfig = SiteConfig;
    this.$onChanges = (changes) => {
      if (changes.fac) {
        readContact(changes.fac.currentValue, this.type);
      }
      if (changes.user) {
        $scope.user = changes.user.currentValue;
      }
    }

    function readContact(fac, type) {
      $scope.fac = fac || {};
      $http.post("stee_data/getActionList", {
        type: type,
        facid: fac.id,
        ac: "电话联系"
      }).then(json => {
        var list = json.datas.rows || [];
        list = list.sort((a, b) => a.time > b.time && -1 || 1);
        $scope.list = list.slice(0, 3);
      })
    }
    var logAction = () => {
      $http.post('stee_data/logAction', {
        k1: this.type,
        k2: this.fac.id,
        v1: "电话联系",
        v2: this.user.uid,
        json: ""
      });
    }

    $scope.OK = function () {
      $scope.$emit("dj-pop-box-close", "OK");
      if ($scope.fac.id) {
        logAction();
      }
    };
    $scope.cancel = function () {
      $scope.$emit("dj-pop-box-close", $q.reject("取消"));
    };
    $scope.onClickBack = function () {
      $scope.$emit("dj-pop-box-close", $q.reject("取消"));
    };
  }
})(window, angular);