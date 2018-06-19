angular.module('steefac').config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/fac-add', {
    template: `
      <place-input form-define='formDefine' models='models'></place-input>
      <div class="weui-btn-area">
        <button class="weui-btn weui-btn_primary" href ng-click='onOk()' ng-class="{'weui-btn_disabled':!models.formatted_address||!formDefine._formObj.$valid}"
          ng-disabled='!models.formatted_address || !formDefine._formObj.$valid'>确定</button>
      </div>
      <p>将要创建的{{objName}}：{{models[objType+'name']}}。
        <a class='weui-cell_warn' ng-if='!formDefine._formObj.$valid'>提交前请正确填写数据，谢谢！</a>
      </p>
    `,
    controller: ['$scope', '$http', '$log', '$location',
      'AppbData', 'FacDefine', 'ProjDefine', 'FacMap', 'SIGN', 'FacUser', 'FacSearch',
      function mzUserSearchCtrl($scope, $http, $log, $location,
        AppbData, FacDefine, ProjDefine, FacMap, SIGN, FacUser, FacSearch) {
        var userData = AppbData.getUserData();

        $scope.objType = $location.search().type;

        if (!FacSearch.isTypeValid($scope.objType)) {
          return appData.showInfoPage('类型错误', 'E:type:' + $scope.objType, '/my');
        }

        $scope.objName = FacSearch.objNames[$scope.objType];

        $scope.formDefine = FacSearch.objDefines[$scope.objType];

        $scope.$on('$viewContentLoaded', function () {
          FacMap.selPositionStart('header', $scope.objName + '定位');
        });
        $scope.$on('$destroy', function () {
          FacMap.selPositionEnd();
        });

        appData.setPageTitleAndWxShareTitle('新增' + $scope.objName);

        if (!FacMap.addrInput[$scope.objType + 'name']) {
          return $location.path('/fac-add-find-name')
        }

        $scope.models = FacMap.addrInput;

        $scope.onOk = function () {
          var dd = {}
          dd.name = FacMap.addrInput[$scope.objType + 'name'];
          dd.addr = FacMap.addrInput.addr;
          dd.lngE7 = FacMap.addrInput.lngE7;
          dd.latE7 = FacMap.addrInput.latE7;
          dd.province = FacMap.addrInput.province;
          dd.city = FacMap.addrInput.city;
          dd.district = FacMap.addrInput.district;
          dd.citycode = FacMap.addrInput.citycode;
          dd.adcode = FacMap.addrInput.adcode;
          dd.formatted_address = FacMap.addrInput.formatted_address;

          var k, i;
          for (var i = $scope.formDefine.inputs.length; i--;) {
            k = $scope.formDefine.inputs[i].name;
            dd[k] = FacMap.addrInput[k]
          }
          SIGN.postLaolin('steeobj', 'add', {
            type: $scope.objType, d: JSON.stringify(dd)
          }).then(function (s) {
            appData.toastMsg('数据已成功保存', 2);
            //$location.path('/obj-detail').search({id:s.id,type:$scope.objType});
            $location.path(($scope.objType == 'steefac' ? '/fac-detail/' : '/project-detail/') + s.id);
            FacUser.getMyData(1);
          }, function (e) {
            appData.toastMsg('保存失败', 8);
            $log.log('err', e);
          });
        }
      }
    ]
  });
}]);
