/*  我要提问  */

!(function (window, angular, undefined) {

  var theModule = angular.module("dj-view")
  theModule.config(["$stateProvider", function ($stateProvider) {

    $stateProvider.state('frame.toask', {
      pageTitle: "提问",
      url: '/toask',
      template: `
<div class="bk-eee">

  <div class="padding15 qa-content-box">
    <!-- 提问内容 -->
    <div class="over-flow-auto">
      <div>
        <d class="hh4 padding5">问题描述:</d>
        <div class="dropdown float-right" css-dropdown-menu="dropdown-menu-right dropdown-menu-single-line" major-dropdown="major"
          major-change="changeMajor()">
        </div>
      </div>
      <mulityinput rows="7" edit="EDIT" placeholder="请在此输入您的提问。如需要，您也可以附加图片等资料，使问题描述更加详细、直观，专家回答更加准确、高效。"></mulityinput>
    </div>
    <!-- 标签 -->
    <tagsinput tags="EDIT.controldata.tags" change="EDIT.updatedraft('tags')"></tagsinput>
    <!-- 出价、时效 -->
    <div class="overflow-auto ww25 row-input hh5">
      <div class="prompt float-left">出价：</div>
      <div class="input-group ww9 float-left">
        <input id="question-easy" class="form-control {{easy.bad&&'border-f00'||''}}" ng-model="easy.model" ng-change="prechange('easy')"
          placeholder="_ _ _ _">
        <span class="input-group-btn">
          <button class="btn bk-ccc" type="button">元</button>
        </span>
      </div>
      <div class="input-group ww7 float-right">
        <input id="question-timelimit" class="form-control {{timelimit.bad&&'border-f00'||''}}" ng-model="timelimit.model" ng-change="prechange('timelimit')"
          placeholder="_ _">
        <span class="input-group-btn">
          <button class="btn bk-ccc" type="button">天</button>
        </span>
      </div>
      <div class="prompt ww4 float-right text-right">时效：</div>
    </div>
    <div class="overflow-auto ww25 hh6 color-888">
      <span class="">请根据问题合理出价</span>
      <span class="float-right">您的问题有效期　</span>
    </div>
    <!-- 按钮 -->
    <button class="btn btn-danger ww25 margin-top10 hh4" ng-click="onsubmit()">提交问题</button>
    <!--surebutton css="ww25 btn-danger margin-top10 hh4" d="RR.bt"></surebutton-->
  </div>

</div>
      `,
      controller: ['$scope', '$http', ctrl]
    })
  }]);


  function ctrl($scope, $http) {
    API.module = "user";
    var qaid = 0;


    //新增专业
    $scope.major = "";
    $scope.changeMajor = function () {
      API.post("/qa/updatedraft", { qaid: qaid, field: "major", value: $scope.major }, {
        success: function () {
        }
      });
    };

    //时效和出价
    (function () {
      var v_min = { easy: 0, timelimit: 1 };
      var v_max = { easy: 999999, timelimit: 30 };
      $scope.initEasyTimelimit = function (attr) {
        $scope.easy = {
          oldValue: +attr.easy,
          model: +attr.easy || "",
          bad: +attr.easy > v_max.easy || +attr.easy < v_min.easy
        };
        $scope.timelimit = {
          oldValue: +attr.timelimit,
          model: +attr.timelimit || "",
          bad: +attr.timelimit > v_max.timelimit || +attr.timelimit < v_min.timelimit
        };
      }
      $scope.check = function (field) {
        switch (field) {
          case "easy":
            var price = toNumber(EDIT.controldata.easy)
            if (price < 0) { API.alert("请出价(不低于0元)"); return false; }
            if (toNumber(EDIT.controldata.timelimit) < 1) { API.alert("请输入问题时效"); return false; }
          case "timelimit":
        }
      }
      $scope.prechange = function (field) {
        if (v_min[field] != void 0) {
          //只能输入数字
          $scope[field].model = $scope[field].model.replace(/[^0-9]/g, "");
          var newValue = +$scope[field].model;
          $scope[field].bad = newValue > v_max[field] || newValue < v_min[field];
          if (newValue != $scope[field].oldValue) {
            $scope[field].oldValue = newValue;
            API.post("/qa/updatedraft", { qaid: EDIT.controldata.qaid, field: field, value: newValue }, {
              success: function () {
              }
            });
          }
        }
      }
    })();

    var EDIT;
    API.get("/qa/usertoask", {}, {
      success: function (json) {
        $http.post("WxJssdk/initWx", {}).then(wx => {
          console.log("WxJssdk/initWx, OK", wx);
        }).catch(e => {
          console.log("WxJssdk/initWx ERROR: ", e);
        }).finally(res => {
          init_ask_data(json.qadetail);
        });
        // API.iswx ?
        //   WXAPP.init(function () { init_ask_data(json.qadetail); }) :
        //   init_ask_data(json.qadetail);
        $scope.major = json.qadetail.jbxx.attr && json.qadetail.jbxx.attr.major || "";
        initMajor();
        $scope.initEasyTimelimit(json.qadetail.jbxx.attr || {});
        $scope.$apply();
      }
    });
    function init_ask_data(detail) {
      var attr = detail.jbxx.attr && initqa_attr($scope, detail.jbxx.attr) || {};
      InitCIA($scope, "EDIT", { keyid: "qaid", url: "/qa/updatedraft" });
      EDIT = $scope.EDIT;
      EDIT.controldata = {
        id: qaid = detail.jbxx.id,
        qaid: detail.jbxx.id,
        easy: toNumber(attr.easy) || '',
        timelimit: toNumber(attr.timelimit) || '',
        tags: attr.tags || "",
        content: attr.content || ""
      }
      EDIT.audios.list = attr.audioslist || [];//录音列表初始化
      EDIT.images.list = attr.imageslist || [];//图像列表初始化
    }

    function initMajor() {
      var major = GetQueryString("major"); //123	234	1122
      if (!major) return;
      major = unescape(major);
      EDIT.controldata = EDIT.controldata || {};
      EDIT.controldata.tags = EDIT.controldata.tags ? (EDIT.controldata.tags + "\t" + major) : major;
      //$scope.major = major;
    }
    //initMajor();


    $scope.onsubmit = function () {
      if (!$scope.major) { API.alert("请选择专业"); return false; }

      var price = $scope.easy.model;
      if (price < 0) { API.alert("请出价(不低于0元)"); return false; }
      if ($scope.timelimit.model < 1) { API.alert("问题时效应为1至30天"); return false; }
      if (EDIT.controldata.content.length < 3) {
        API.alert("提问正文至少3个字符"); return false;
      }
      var expertpoints = toNumber(API.userinfo.expertpoints, API.userinfo.referrertpoints);
      var points = toNumber(API.userinfo.points, API.userinfo.prepoints);
      var canuse = points + (expertpoints > 0 && expertpoints || 0);
      if (price > canuse) {
        API.confirm("<br>您当前的可用余额不足，请点击“确定”充值。<br><br>", function () {
          window.location.href = "#/frame/recharge";
        });
        return false;
      }
      //发出提问：
      var str = (price ? "发出本提问将消耗 " + price + " 个积分" : "你没有出价！") + "<br>您确认要发出？<br><br>";
      API.confirm(str, function () {
        API.post("/qa/toask", { qaid: EDIT.controldata.id }, {
          success: function (json) {
            if (json.errcode !== 0) {
              API.alert(json.errmsg);
              $scope.$apply();
            } else {
              API.userinfo.changed = true; //预扣了积分
              window.location.href = "#/frame/user-qa-show?qaid=" + json.qaid;
            }
          }
        });
      });
    }

  }
})(window, angular);
