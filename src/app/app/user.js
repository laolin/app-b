


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          register                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

function RegisterCtrl($scope, $http) {
  window.setTimeout(enablePlaceholder, 10);
  document.title = "请高手 - 注册";
  $scope.registing = false;

  $scope.register = function (){
    if($scope.registing)return;
    if(!$scope.password){
      $scope.prompt = "请输入密码";
      return;
    }
    if($scope.password != $scope.password2){
      $scope.prompt = "两次密码不一致。";
      return;
    }
    $scope.prompt = "正在注册...";
    $scope.registing = true;

    var myDate = new Date();
    var t = (myDate.getTime()/1000).toFixed()

    $http.get( API.root + "/user/register?module=user&mobile="+$scope.mobile + "&password="+API.MD5($scope.password))
      .success(function(json){
        if( json.errcode !== 0){
          window.setTimeout(function(){$scope.registing = false;$scope.$apply();}, 1500);
          $scope.prompt = json.errmsg;
          $scope.$apply();
          return;
        }
        API.setCookie("user_loginmode", "login");
        API.setCookie("user_id", json.id);
        API.setCookie("user_password", API.MD5($scope.password));
        window.location.href = "#/frame/myaccount";
      })
      .error(function(){
        $scope.prompt = "注册失败";
        $scope.$apply();
        window.setTimeout(function(){$scope.registing = false;$scope.$apply();}, 1500);
      })
    return true;
  }
}


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          我的账号                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("UserInfoController", function ($scope) {
  $scope.setmodule = function(en){
    if(en != 'user' && en != 'expert' && en != 'service')return;
    API.module = en;
    API.post("/user/savemodule", {}, {});
    //window.location.href = "#/frame/myaccount?module=" + en;
  }
  $scope.setmodule(GetQueryString("module"));

  var D;
  $scope.editing = false;
  $scope.save = function(){
    $scope.editing = false;
    API.post({
      url: "/user/savedatas",
      data: {datas: D},
      success: function(json){
      }
    });
  }
  $scope.reset = function(){
    $scope.editing = false;
    API.$scope.reget(function(json){
      API.module = json.userinfo.loginmodule;
      D= $scope.D = {
        name      : API.userinfo.name,
        mobile    : API.userinfo.mobile,
        majoruser   : API.userinfo.majoruser,
        majorservice: API.userinfo.majorservice,
        majorexpert : API.userinfo.majorexpert,
        company   : API.userinfo.company
      }
      $scope.$apply();
    });
  }
  $scope.reset();
})

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          各种积分列表                                ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("MyUserPointsCtrl", function($scope) {
  API.module = "user";
  $scope.D = {
    pagesize:10, 
    sublist: [ {en:"userpoints", cn:"用户积分"}],
    baseAPI: "/user/pointslist",
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
});
CTRL("MyExpertPointsCtrl", function($scope) {
  API.module = "expert";
  $scope.D = {
    pagesize:10, 
    sublist: [ {en:"expertpoints", cn:"专家积分"}],
    baseAPI: "/user/pointslist",
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
});
CTRL("ServiceGetUserPointsListCtrl", function($scope) {
  API.module = "service";
  var userid = toNumber(GetQueryString("userid"));
  $scope.D = {
    pagesize:15, 
    sublist: [{en:"a", cn:"a"}],
    post:{userid: userid},
    baseAPI: "/user/getuserpointslist"
  }
  InitSmartPage($scope, $scope.D);
});
CTRL("ServiceGetExpertPointsListCtrl", function($scope) {
  API.module = "service";
  var userid = toNumber(GetQueryString("userid"));
  $scope.D = {
    pagesize:15, 
    sublist: [{en:"a", cn:"a"}],
    post:{userid: userid},
    baseAPI: "/user/getexpertpointslist"
  }
  InitSmartPage($scope, $scope.D);
});

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          支付                                        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

CTRL("RechargeCtrl", function($scope) {
  API.module = "user";
  $scope.API = API;
  $scope.recharge100 = "500";
  $scope.paytext = "充值";
  $scope.paying = false;
  $scope.recharge = function(){
    if($scope.paying)return;
    $scope.paying = true;
    if(API.iswx) {
      $scope.paytext = "正在支付...";
      $scope.paying = true;
      callpay(API.userinfo.id, $scope.recharge100, "qgsrecharge", function(b){
        if(b){
          window.location.href = "#/frame/mypay";
        }
        else{
          $scope.paytext = "充值";
          $scope.paying = 0;
          $scope.$apply();
        }
      });
    }
    else {
      var wxQrocdePay = new WxQrocdePay({payorder:{orderid: 0, fen: $scope.recharge100 * 100, paymodule: "qgsrecharge"}});
      wxQrocdePay.get_qr2_url(function(url){
        var url = "http://paysdk.weixin.qq.com/example/qrcode.php?data=" + encodeURIComponent(url);
        API.alert('<div class="ww25 text-center"><img class="ww15em" src="'+url+'"><br>微信扫一扫支付</div>', 
          function(){
            $scope.paying = false;
            wxQrocdePay.cancel_pay();
          },
          {
            OKtext: "取消"
          }
        );
        $scope.$apply();
        wxQrocdePay.check_pay(function(b){
          if(b){
            window.location.href = "#/frame/mypay";
          }
          else{
            $scope.paytext = "充值";
            $scope.paying = 0;
            $scope.$apply();
          }
        });
      })
      return;
    }
    
    var openid = API.userinfo && API.userinfo.wx && API.userinfo.wx.openid;
    if(!openid){
      API.alert("请使用微信客户端支付");
      return;
    }
    if($scope.paying)return;
    $scope.paytext = "正在支付...";
    $scope.paying = true;
    callpay(API.userinfo.id, $scope.recharge100, "qgsrecharge", function(b){
      if(b){
        window.location.href = "#/frame/mypay";
      }
      else{
        $scope.paytext = "充值";
        $scope.paying = 0;
        $scope.$apply();
      }
    });
  }
});
CTRL("MyPaylistCtrl", function($scope) {
  API.module = "user";
  $scope.D = {
    pagesize:10, 
    sublist: [ {en:"all", cn:"全部"}],
    baseurl: "#/frame/mypay",
    baseAPI: "/user/paylist",
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
});

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          用户密码                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("PasswordCtrl", function ($scope) {
  if(!API.module)API.module = "user";
  
  $scope.changepassword = function(){
    if($scope.p1 != $scope.p2){
      $scope.prompt = "两次密码输入不一致";
      return;
    }
    API.post({
      url: "/user/changepassword",
      data:{ p0: MD5($scope.p0+"@qgs"), p1: MD5($scope.p1+"@qgs")},
      success: function(json){
        if( json.errcode == 0){
          setCookie("gs_user_password", MD5($scope.p1+"@qgs"));
          $scope.p0=$scope.p1=$scope.p2="";
          $scope.prompt = "密码设置成功！";
          $scope.$apply();
        }
        else{
          $scope.prompt = json.errmsg;
          $scope.$apply();
        }
      }
    });
  }
})

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          关联人绑定                                  ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("RefereeCtrl", function ($scope) {
  var refereeid = toNumber(GetQueryString("rid"));
  API.$scope.reget(function(json){
    //如果已经有推荐人，不再关联
    if(API.userinfo.options && API.userinfo.options.referrer){
      test_gz();
      return;
    }
    
    //如果已经激活，不再关联
    if(API.hasactivemodule()){
      test_gz();
      return;
    }
    
    //未激活且未关联的
    API.post({
      url:"/user/setrefereeid",
      data: {rid:refereeid},
      success: function(json){
        if(json.errcode == 0){
          $scope.referrer = json.referrer;
          $scope.$apply()
          test_gz();
        }
        else{
          test_gz();
        }
      }
    });
  });
  
  //没关注的，才停留在这里
  function test_gz(){
    if(API.userinfo.wx.isgz == '已关注')
      window.location.href = "#/frame/myaccount";
  }
})


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          推荐朋友                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("QrCodeControl", function ($scope) {
  $scope.userid = toNumber(GetQueryString("userid") || API.getCookie("share_id"));
  API.get("/user/getfullinfo", {}, {
    success: function(json){
      if(json.errcode == 0){
        fn_logged(json);
      }
      else fn_guest(); //用户现在是未成功登陆状态
    },
    error: function(){
      fn_guest();
    }
  });
  function fn_logged(json){
    $scope.logged = true;
    $scope.userid = json.userinfo.id;
    $scope.username = json.userinfo.name;
    WXAPP.setShare();
    API.get("/user/getmyreferedinfo", { }, { success: function( json){
      if(json.errcode !== 0)return;//
      $scope.refered = json.info;
      $scope.$apply();
    }});
    $scope.$apply();
  }
  function fn_guest(){
    $scope.logged = false;
    $.ajax({
      url: API.root + "/user/getusernamebyid?userid=" + $scope.userid,
      dataType: "json",
      success: function(json){
        $scope.userid = json.userid;
        //window.location.hash = "#/qrcode?userid=" + $scope.userid;
        $scope.username = json.name;
        WXAPP.setShare();
        $scope.$apply();
      }
    });
  }
})

//指定userid=xxx 推荐的人的列表
//这个可能要放在serveic目录下？先放在这了
CTRL("GetUserReferedListControl", function ($scope) {
  var D = $scope.D = {
    pagesize: 8, 
    sublist: [{en:"all",cn:"全部"} ],
    baseurl: "#/frame/myreferedlist",//??有什么用的不知道
    baseAPI: "/user/getreferedlist",
    defaultlist: 0,
    post:{page: 0,userid:toNumber(GetQueryString("userid"))},
    searchtext:"",
    search: function(){
      D.post.searchtext = D.searchtext;
      D.post.page = 0;
      D.gotopage(D.post.page);
    }
  }
  InitSmartPage($scope, $scope.D);
})

CTRL("MyReferedInfoControl", function ($scope) {
  API.$scope.reget(function(json){
    API.get("/user/getmyreferedinfo", { }, { success: function( json){
      if(json.errcode !== 0)return;//
      $scope.refered = json.info;
      $scope.$apply();
    }});
  });
});

