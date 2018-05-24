
!(function (window, angular, undefined) {

  var theModule = angular.module("dj-view")
  theModule.component('loginByUserForm', {
    template: `
<div class="ww25 hhh25 bk-fff">
  <br><br><br>
  <div class="container">
    <div class=row>
      <div class="col-xs-offset-0 col-xs-12  col-md-offset-3 col-md-6">
      <form name='form1' ng-submit="login()">
        <div class="userlist-item">
          <img src='http://qinggaoshou.com/qgs/images/logo-128.png'>
          <span class="hh3 text1 b900">请高手 用户登陆</span>
        </div>
        <br/>
        <div class="form-group">
          <input name="nick" ng-model="nick"  class="list-group-item form-control superior-id" placeholder="手机号码，或请高手平台ID">
        </div>
        <div class="form-group">
          <input name="password" type="password" ng-model="password" class="list-group-item form-control password" placeholder="密码">
        </div>
        <h5></h5>
        <div class="text-center hh4">
          <input type="checkbox" ng-model="keeplogin" name="keeplogin">
          <label for=favcolor>保持我的登陆状态</label>
        </div>
        <h5></h5>
        <div class="text-center text-info ui-content">
          <button type="submit" class="btn {{logining&&'color-888'||'color-fff btn-primary'}} btn-lg btn-block" ng-disabled="logining">登陆</button>
        </div>
        <div class="text-center text-info ui-content">
          <h4>没有请高手ID? <a href="#/register" class="text-info">现在创建一个</a></h4>
        </div>
        <div class="text-warning fee">
          {{prompt}}
        </div>
      </form>
      </div>
    </div>
  </div>
  <br><br><br>
</div>
    `,
    bindings: {
      pageTo: '<'
    },
    controller: ['$scope', '$http', ctrl]
  });


  function ctrl($scope, $http) {
    $scope.keeplogin = true;
    $scope.logining = false;

    $scope.login = function () {
      if ($scope.logining) return;
      $scope.prompt = "正在登陆...";
      $scope.logining = true;
      //window.setTimeout(function(){$scope.logining = false;$scope.$apply();}, 1500);

      var myDate = new Date();
      var t = (myDate.getTime() / 1000).toFixed();

      API.setCookie("user_password", API.MD5($scope.password));
      API.get("/user/login", { nick: $scope.nick }, {
        success: function (json) {
          if (json.errcode !== 0) {
            window.setTimeout(function () { $scope.logining = false; $scope.$apply(); }, 1500);//$scope.logining = false;
            $scope.prompt = json.errmsg;
            $scope.$apply();
            return;
          }
          var keepminute = 10 * 24 * 60// 保持10天
          API.setCookie("user_id", json.id, API.keeplogin);
          API.setCookie("user_openid", "", 0);
          API.setCookie("user_password", API.MD5($scope.password), $scope.keeplogin && API.keeplogin);//密码按选择决定是否保存10天

          //到上次登陆的模块
          var return_url = API.getCookie("return_url");
          if (return_url) {
            API.setCookie("return_url", '');
            window.location.href = return_url;
            return;
          }
          window.location.href = "#/frame/myaccount";
        },
        error: function (e) {
          $scope.logining = false;
          $scope.prompt = "登陆失败";
          $scope.$apply();
        }
      });
      return true;
    }
  }
})(window, angular);
