!(function (angular, window, undefined) {

  angular.module('steefac').component('rolerightEdit', {
    template: `
      <div class="weui-panel weui-panel_access" ng-if="me.rightUserIcons.length">
        <div class="weui-panel__hd">普通功能授权</div>
        <div class="weui-panel__bd">
          <div class="text-icon-list flex flex-left flex-wrap">
            <text-icon fa="{{item.fa}}" text="{{item.name}}" color="{{oauthed[item.name] && item.color|| '#ccc'}}" ng-click="clickItem(item)" ng-repeat="item in me.rightUserIcons"></text-icon>
          </div>
        </div>
      </div>


      <div class="weui-panel weui-panel_access" ng-if="me.rightAdminIcons.length">
        <div class="weui-panel__hd">系统功能授权</div>
        <div class="weui-panel__bd">
          <div class="text-icon-list flex flex-left flex-wrap">
            <text-icon fa="{{item.fa}}" text="{{item.name}}" color="{{oauthed[item.name] && item.color|| '#ccc'}}" ng-click="clickItem(item)" ng-repeat="item in me.rightAdminIcons"></text-icon>
          </div>
        </div>
      </div>


      <div class="flex flex-arround padding-3">
        <button class="btn btn-primary"
          ng-click="save()"
          ng-disabled="!changed"
        >保存</button>
        <div class="flex flex-arround text-warning">
          {{savePrompt}}
        </div>
      </div>
      `,
    controller: ['$scope', '$rootScope', '$location', '$timeout', '$http', '$q', ctrl]
  })

  function ctrl($scope, $rootScope, $location, $timeout, $http, $q) {
    var userid = $location.search().userid;
    if (!userid) {
      $location.path("/user-search").search({}).replace();
      return;
    }

    $scope.ajaxing = true;
    $http.post("用户/个人信息")
      .then(json => {
        $scope.me = json.datas;
        return $http.post("roleright/get_user", { userid })
      })
      .then(json => {
        $scope.ajaxing = false;
        $scope.user = json.datas.user;
        $scope.oauthed = {};
        $scope.user.rights.map(right => {
          $scope.oauthed[right] = 1;
        })
        return $http.post("用户/微信数据", $scope.user.uid)
      })
      .then(json => {
        $scope.user = angular.extend({}, $scope.user, json.datas.wx);
        $scope.oauthed = {};
        $scope.user.rights.map(right => {
          $scope.oauthed[right] = 1;
        })
      })
      .catch(e => {
        console.log('查找用户失败：', e);
      });


    /**
     * 权限操作部分
     */
    $scope.changed = false;
    $scope.clickItem = (item) => {
      $scope.changed = true;
      $scope.oauthed[item.name] = !$scope.oauthed[item.name];
    }
    $scope.save = (item) => {
      $scope.savePrompt = "正在保存...";
      var rights = Object.keys($scope.oauthed).filter(k=>$scope.oauthed[k]);
      $http.post("roleright/save_user", { userid, rights })
      .then(json=>{
        $scope.changed = false;
        $scope.savePrompt = "已保存";
        $timeout(()=>{$scope.savePrompt = ""}, 2000);
      })
      .catch(e=>{
        $scope.savePrompt = "保存失败";
        $timeout(()=>{$scope.savePrompt = ""}, 5000);
      })
    }
  }

})(angular, window);
