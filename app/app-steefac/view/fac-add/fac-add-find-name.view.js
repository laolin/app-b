angular.module('steefac').config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/fac-add-find-name', {
    template: `
      <div class="weui-cells">
        <div class="weui-cells__title">请先输入{{objName}}名字，搜索是否已有数据</div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label ng-binding">{{objName}}：</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="input" placeholder="请输入{{objName}}名字" name="input_name" ng-minlength='4' ng-maxlength='30'
              ng-change='onChange()' ng-model="FacMap.addrInput[objType+'name']">
          </div>
        </div>
      </div>

      <div class="weui-btn-area">
        <button class="weui-btn weui-btn_primary" ng-click="onFindFac()" ng-class="{'weui-btn_disabled':!FacMap.addrInput[objType+'name'] || isLoading>0}"
          ng-disabled='!FacMap.addrInput[objType+"name"] || isLoading>0'>搜索是否已有数据
        </button>
      </div>

      <appb-ui-loading ng-if='isLoading>0'></appb-ui-loading>

      <div ng-if='searchDone && facList.length==0'>
        <appb-weui-cells title='未找到以下{{objName}}}的数据' cells="[
          {
            text: FacMap.addrInput[objType+'name'],
            url: onNewFac,
            icon: 'plus',
            notes: '点击此处创建'
          },
        ]"
        ></appb-weui-cells>
        <button class="weui-btn weui-btn_primary" ng-click="onNewFac()">创建</button>
      </div>

      <fac-list ng-if='searchDone && facList.length' title='"已找到以下数据"' type=' objType ' fac-list='facList' page-number='0' page-size='100'>
      </fac-list>

      <div class="weui-cells__title" ng-if='facList.length>9'>
        还有更多数据，请输入更具体的名字，以减少搜索结果。
      </div>
    `,
    controller: ['$scope', '$http', '$log', '$location',
      'AppbData', 'FacDefine', 'FacMap', 'SIGN', 'FacSearch',
      function mzUserSearchCtrl($scope, $http, $log, $location,
        AppbData, FacDefine, FacMap, SIGN, FacSearch) {
        var userData = AppbData.getUserData();
        var appData = AppbData.getAppData();

        $scope.objType = $location.search().type;

        if (!FacSearch.isTypeValid($scope.objType)) {
          return appData.showInfoPage('类型错误', 'E:type:' + $scope.objType, '/my');
        }

        $scope.objName = FacSearch.objNames[$scope.objType];

        appData.setPageTitleAndWxShareTitle('新增' + $scope.objName);

        $scope.facList = [];
        $scope.isLoading = false;
        $scope.searchDone = false;
        $scope.FacMap = FacMap;
        $scope.onChange = function () {
          $scope.searchDone = false;
        }
        $scope.onNewFac = function () {
          appData.dialogData.msgBox(
            '请您确认：您将创建的' + $scope.objName + '正式的全名为【' +
            FacMap.addrInput[$scope.objType + 'name'] +
            '】，创建后不能修改名字。',

            '准备创建' + $scope.objName,
            '确认全名', '修改全名',
            function () {
              $location.path('/fac-add').search({ type: $scope.objType });
            }
          );
        }

        $scope.onFindFac = function () {
          $scope.facList = [];
          $scope.searchDone = false;
          $scope.isLoading = 1;

          SIGN.postLaolin('steeobj', 'search', {
            type: $scope.objType, s: FacMap.addrInput[$scope.objType + 'name'], count: 10
          }).then(function (s) {
            $scope.searchDone = 1;
            $scope.isLoading = 0;
            $scope.facList = s;
          }, function (e) {
            appData.toastMsg('搜索失败', 3);
            $log.log('err', e);
            $scope.isLoading = 0;
          });
        }
      }
    ]
  });
}]);
