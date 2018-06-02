
!(function (window, angular, undefined) {

  var theModule = angular.module("dj-view");

  theModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('frame.recharge', {
        pageTitle: "问答详情",
        url: '/recharge',
        template: `
          <div class="">
            <div class="ww25 padding15">
              <div class="input-group ww25 padding5 margin-bottom15">
                <span class="input-group-btn"><span class="btn btn-default bk-eee ">充值金额(元)</span></span>
                <input type="text" class="form-control text-center" ng-model="recharge100">
                <span class="input-group-btn"><span class="btn btn-warning b900" ng-click="recharge()">{{paytext}}</span></span>
              </div>
              <div class="ww25">
                <span class="btn btn-danger disabled margin5" ng-click="recharge100='100'">100元</span>
                <span class="btn btn-danger disabled margin5" ng-click="recharge100='200'">200元</span>
                <span class="btn btn-danger disabled margin5" ng-click="recharge100='500'">500元</span>
                <span class="btn btn-danger disabled margin5" ng-click="recharge100='1000'">1000元</span>
                <span class="btn btn-danger disabled margin5" ng-click="recharge100='2000'">2000元</span>
                <span class="btn btn-danger disabled margin5" ng-click="recharge100='5000'">5000元</span>
                <span class="btn btn-danger disabled margin5" ng-click="recharge100='10000'">10000元</span>
              </div>
            </div>
            <div class="ww25 padding15 border-top border-eee">
              <a href="#/frame/mypay" class="pull-right">充值记录</a>
            </div>
          </div>`,
        controller: ['$scope', '$http', '$q', ctrl]
      })
  }]);


  function ctrl($scope, $http, $q) {
    API.module = "user";
    $scope.API = API;
    $scope.recharge100 = "500";
    $scope.paytext = "充值";
    $scope.paying = false;
    $scope.recharge = function () {
      if ($scope.paying) return;
      $scope.paying = true;

      return $http.post("WxJssdk/initWx").then(wx => {
        var param = { uid: API.userinfo.id, recharge100: $scope.recharge100, paymodule: 'qgsrecharge' };
        return $http.post("请求微信支付", {
          orderParam: { uid: API.userinfo.id, recharge100: $scope.recharge100, paymodule: 'qgsrecharge' },
          api_payParam: 'old-api/wxpay/recharge',
          api_CheckPay: 'old-api/wxpay/checkpay',
        })
          .then(json => {
            $state.go('frame.mypay');
          })
          .catch(e => {
            $scope.paytext = "充值";
            $scope.paying = 0;
          });
      }).catch(e => {
        return $http.post("请求微信二维码支付", {
          orderParam: { orderid: 0, fen: $scope.recharge100 * 100, paymodule: "qgsrecharge" },
          api_QrCode: 'old-api/wxpay/getqrpay2url',
          api_CheckPay: 'old-api/wxpay/checkpay',
        })
          .then(json => {
            $state.go('frame.mypay');
          })
          .catch(e => {
            $scope.paytext = "充值";
            $scope.paying = 0;
          });

      })
    }
  }

})(window, angular);
