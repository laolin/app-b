
!(function (window, angular, undefined) {

  var theModule = angular.module("dj-view");

  theModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('frame', {
        url: '/frame',
        template: `
<div class="" id="afterlogin">
  <div class="page-nav-container-bg-top"></div>

  <div class="page-nav">
    <img src="http://qinggaoshou.com/qgs/images/ask-top.jpg">
    <div class="poster" id="main-poster">
      <a>遍访高手，造福众生。</a>
      <a>更专业的人做更专业的事。</a>
      <a>搞不定，请高手。</a>
      <a>一问一答，其妙无穷。</a>
    </div>
  </div>

  <div class="body-v100">
    <div class="page-nav-div"></div>
    <div class="col-180" id="form-views" ui-view></div>
    <div class="page-nav-container-bg-bottom"></div>
  </div>

  <pagedialog id="mainpagedialog" dlg="maindlg"></pagedialog>

  <div class="page-nav-container">
    <div class="col-180">
      <div class="icons">
        <div class="box " onclick="wx.closeWindow()" ng-show="API.iswx">
          <span class="icon glyphicon glyphicon-log-out color-800"></span>
          <div class="text color-800">返回微信</div>
        </div>
        <div class="box " ui-sref-active="active" ui-sref=".{{item.href}}" ng-repeat="item in API.navmenu[API.module]">
          <span class="icon glyphicon glyphicon-{{item.icon}}" ng-if="item.icon"></span>
          <i class="icon fa fa-{{item.fa}}" ng-if="item.fa"></i>
          <div class="text">{{item.text}}</div>
        </div>
      </div>
      <div class="hide-max-3 search" ng-show="API.module=='service'">
        <div class="input-group">
          <input type="text" class="form-control" ng-model="API.quicksearchtext" size=10>
          <span class="input-group-btn">
            <button class="btn btn-info" type="button" ng-click="quicksearch()">搜索</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
        `,
        controller: ['$scope', '$http', ctrl]
      })
  }]);


  function ctrl($scope, $http) {
    $("#main-poster").PPT_POSTER({});

    API.fn_guest = gotologin;
    $scope.API = API;
    //$scope.USER = USER;
    API.$scope = $scope;

    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
    //主对话框
    var maindlg = $scope.maindlg = {};
    function show_maindlg(options) {
      options.text && $("#mainpagedialog .prompt").html(options.text);
      options.onshow && options.onshow($("#mainpagedialog .prompt"));
      maindlg.showing = true;
      maindlg.tpl = false;
      maindlg.btns = options.btns || false;
      maindlg.OKtext = options.OKtext || "确定";
      maindlg.CANCELtext = options.CANCELtext || "取消";
      maindlg.OK = function (scope) {
        options.OK && options.OK();
      }
      maindlg.CANCEL = options.CANCEL && function (scope) {
        options.CANCEL && typeof options.CANCEL == 'function' && options.CANCEL();
      }
    }
    API.tips = function (s, options) {
      show_maindlg({
        text: s,
        btns: []
      });
      !options && (options = {});
      if (options.delay) {
        window.setTimeout(function () {
          options.onhide && options.onhide();
          maindlg.showing = false;
          $scope.$apply();
        }, options.delay);
      }
    }
    API.alert = function (s, OK, options) {
      show_maindlg($.extend({
        onshow: function (div) {
          div.html(s);
        },
        OK: OK
      }, options));
    }
    API.confirm = function (s, OK, CANCEL) {
      show_maindlg({
        onshow: function (div) {
          div.html(s);
        },
        OK: OK,
        CANCEL: CANCEL || 1
      });
    }

    //重新获取数据
    $scope.regeting = false;
    var fn_cache = [];//请求堆栈
    $scope.reget = function (fn_after) {
      typeof fn_after == 'function' && fn_cache.push(fn_after);//请求先堆栈，待数据获取后执行。
      if ($scope.regeting) return;
      $scope.regeting = true;
      API.get("/user/getfullinfo", {}, {
        success: function (json) {
          if (json.errcode == 0) {
            API.setuserinfo(json.userinfo);
            //alert("已获取用户信息，设置分享");
            //处理请求堆栈
            while (fn_cache.length > 0) {
              (typeof fn_cache[0] == 'function') && fn_cache[0](json);//堆栈先进先出
              fn_cache.splice(0, 1);
            }
            //ng脏数据清洗
            $scope.$apply();
            $scope.regeting = false;
          }
          else API.fn_guest(); //用户现在是未成功登陆状态
        },
        error: function () {
          API.fn_guest();
        }
      });
    }
    //$scope.reget(fn_logged);

    $scope.usertypes = function (sep, user) {
      user = user || API.userinfo;
      var s = [];
      if (user.userstate == '3') s.push('用户');
      if (user.expertstate == '3') s.push('专家');
      if (user.servicestate == '3') s.push('编导');
      return s.join(sep || ",");
    }

    $scope.logout = function () {
      if (API.iswx) return;
      API.setCookie("user_id", 0);
      API.setCookie("user_openid", "");
      API.setCookie("user_password", "");
      gotologin();
    }
    //申请激活
    $scope.activeaplly = function () {
      API.post({
        url: "/user/activeaplly",
        data: { usermodule: API.module },
        success: function (json) {
          API.userinfo[API.module + 'state'] = 1;
          API.isnotapplyed = false;
          $scope.$apply();
          tooltipsdelay($("#activestate"), "<hh5>已申请成功</hh5>", 2000);
        }
      });
    }
    //更新资料
    $scope.selectuserinfo = function (field, value) {
      API.userinfo[field] = value;
      $scope.updateuserinfo(field);
    }
    //更新资料
    $scope.tttt = function (a) {
      alert(a);
    }
    //更新资料
    $scope.updateuserinfo = function (field, istips) {
      API.post({
        url: "/user/updateitem",
        data: { field: field, value: API.userinfo[field] },
        success: function (json) {
          if (json.errcode !== 0) {
            $scope.$apply();
            //tooltipsdelay( $("#userinfo-" + field), "<hh5>"+json.errmsg+"</hh5>", 2000);
            return;
          }
          istips && tooltipsdelay($("#userinfo-" + field), "<hh5>已更新</hh5>", 2000)
        }
      });
    }
    // 
    $scope.tip = function (field, text) {
      tooltipsdelay($("#userinfo-" + field), "<hh4>" + text + "</hh4>", 1000)
    }

    //利用微信播放声音：
    $scope.palyRecord = function (localId) {
      wx.playVoice({ localId: localId });
    }
    //利用微信预览图片组：
    $scope.preview = function (pic, arr) {
      (API.iswx && wx.previewImage || $.previewImage)
        ({
          current: pic, // 当前显示图片的http链接
          urls: arr // 需要预览的图片http链接列表
        });
    }
    $scope.previewself = function (pic) {
      (API.iswx && wx.previewImage || $.previewImage)({
        current: pic, // 当前显示图片的http链接
        urls: [pic] // 需要预览的图片http链接列表
      });
    }
    //相对路径的图片预览：
    $scope.previewlocal = function (piclocal, arrlocal) {
      var pic = SITE.root + piclocal;//因为API数据库中保存相对路径
      var arr = [];
      for (var i in arrlocal) arr.push(SITE.root + arrlocal[i]);
      (API.iswx && wx.previewImage || $.previewImage)({
        current: pic, // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      });
    }

    $scope.urlEncode = function (url) {
      return encodeURIComponent(url);
    }

    // ━━━━━━━━━ 搜索 ━━━━━━━━━━━━━━━━━━━━
    API.quicksearchtext = GetQueryString("text");
    $scope.quicksearch = function () {
      API.search = {};
      API.quicksearching = API.quicksearchtext;
      API.post({
        url: "/search/search",
        data: { searchtext: API.quicksearching, page: 1, pagesize: 100 },
        success: function (json) {
          API.search.QA = json.QA;
          //API.search.USER = json.USER;
          $scope.$apply();
        }
      });

      window.location.href = "#/frame/search?text=" + API.quicksearchtext;
    }
  }

})(window, angular);
