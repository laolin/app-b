
// app.js
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================

var myapp = window.myapp = angular.module('frameApp', ['ngAnimate', 'appFilters', 'ui.router']);

window.dcode && window.dcode.debug();

 myapp
// configuring our routes 
// =============================================================================
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider
    .when("", "frame/myaccount")
  //.when('/frame/myaccount-user', 'myaccount?module=user')

  $stateProvider
        .state('register', {
            url: '/register',
            templateUrl: templateUrl('page/login/register.html')//'login/register.html?v=1108'
        })
        .state('user', {
            url: '/user',
            templateUrl: templateUrl('frame/frame.html')
        })
        .state('expert', {
            url: '/expert',
            templateUrl: templateUrl('expert/frame.html')
        })
        .state('service', {
            url: '/service',
            templateUrl: templateUrl('frame/frame.html')
        })
        .state('qrcode', {
            url: '/qrcode',
            templateUrl: templateUrl('page/user/user-qrcode.html')
        })
        .state('frame.search', {
            url: '/search',
            templateUrl: templateUrl('search/search.html')
        })

        // ---------- 问题部分 -----------------      
        .state('frame.qa', {
            url: '/qa',
            templateUrl: templateUrl('page/qa/qa-list.html')
        })
        .state('frame.myask', {
            url: '/myask',
            templateUrl: templateUrl('page/qa/myask.html')
        }) 
        .state('frame.myanswer', {
            url: '/myanswer',
            templateUrl: templateUrl('page/qa/myanswer-list.html')
        })
        //.state('frame.toask', {
        //    url: '/toask',
        //    templateUrl: templateUrl('page/qa/qa-toask.html')
        //})
        .state('frame.toanswerlist', {
            url: '/toanswerlist',
            templateUrl: templateUrl('page/qa/toanswer-list.html')
        })
        // .state('frame.user-qa-show', {
        //     url: '/user-qa-show',
        //     templateUrl: templateUrl('page/qa/qa-show.html')
        // })
        // .state('frame.service-qa-show', {
        //     url: '/service-qa-show',
        //     templateUrl: templateUrl('page/qa/qa-show.html')
        // })
        // .state('frame.expert-qa-show', {
        //     url: '/expert-qa-show',
        //     templateUrl: templateUrl('page/qa/qa-show.html')
        // })


        // ---------- 专家库 -----------------   
        .state('frame.expert', { //主页为列表
            url: '/expert',
            templateUrl: templateUrl('page/kl/expert-list.html')
        })
        .state('frame.expertshow', { //专家详情
            url: '/expertshow',
            templateUrl: templateUrl('page/kl/expert-show.html')
        })
        .state('frame.editexpert', { // 修改专家信息
            url: '/editexpert',
            templateUrl: templateUrl('page/kl/expert-edit.html')
        })
        .state('frame.addexpert', { // 添加专家
            url: '/addexpert',
            templateUrl: templateUrl('page/kl/expert-add.html')
        })


        // --------------- 编导模块 - 知识库 --------------
        .state('frame.kl-list', {
            url: '/kl-list',
            templateUrl: templateUrl('page/kl/kl-list.html')
        })
        .state('frame.kl-show', {
            url: '/kl-show',
            templateUrl: templateUrl('page/kl/kl-show.html')
        })
        // ----------------- 专家模块 - 知识库 -----------------
        .state('frame.expert-kl-list', {
            url: '/expert-kl-list',
            templateUrl: templateUrl('page/kl/expert-kl-list.html')
        })
        .state('frame.expert-kl-show', {
            url: '/expert-kl-show',
            templateUrl: templateUrl('page/kl/expert-kl-show.html')
        })

        // ---------- 论坛 -----------------
        .state('frame.bbs-home-user', {
            url: '/bbs-home-user',
            templateUrl: templateUrl('page/bbs/bbs-home-user.html')
        })
        .state('frame.bbs-new', {
            url: '/bbs-new',
            templateUrl: templateUrl('page/bbs/bbs-new.html')
        })
        .state('frame.bbs-list-user', {
            url: '/bbs-list-user',
            templateUrl: templateUrl('page/bbs/bbs-list-user.html')
        })
        .state('frame.bbs-show-user', {
            url: '/bbs-show-user',
            templateUrl: templateUrl('page/bbs/bbs-show-user.html')
        })
        .state('frame.bbs-home-service', {
            url: '/bbs-home-service',
            templateUrl: templateUrl('page/bbs/bbs-home-service.html')
        })
        .state('frame.bbs-list-service', {
            url: '/bbs-list-service',
            templateUrl: templateUrl('page/bbs/bbs-list-service.html')
        })
        .state('frame.bbs-show-service', {
            url: '/bbs-show-service',
            templateUrl: templateUrl('page/bbs/bbs-show-service.html')
        })




        // --------------- 用户管理部分 --------------
        .state('frame.userlist', {
            url: '/userlist',
            templateUrl: templateUrl('page/user/userlist.html')
        })
        .state('frame.usershow', {
            url: '/usershow',
            templateUrl: templateUrl('page/user/usershow.html')
        })
        .state('frame.usershow2', {
            url: '/usershow2',
            templateUrl: templateUrl('page/user/usershow.html')
        })
        .state('frame.useredit', {
            url: '/useredit',
            templateUrl: templateUrl('page/user/useredit.html')
        })
        .state('frame.useroptions', {
            url: '/useroptions',
            templateUrl: templateUrl('page/user/useroptions.html')
        })
        .state('frame.userroleright', {
            url: '/userroleright',
            templateUrl: templateUrl('page/user/userroleright.html')
        })
        .state('frame.role-admin', {
            url: '/role-admin',
            templateUrl: templateUrl('page/user/role-admin.html')
        })
        .state('frame.usertrace', {
            url: '/usertrace',
            templateUrl: templateUrl('page/user/usertrace.html')
        })
        .state('frame.expertpointslist', {
            url: '/expertpointslist',
            templateUrl: templateUrl('page/user/points-list-expert-by-service.html')
        })
        .state('frame.userpointslist', {
            url: '/userpointslist',
            templateUrl: templateUrl('page/user/points-list-user-by-service.html')
        })


        //用户部分
        .state('frame.myaccount', {
            url: '/myaccount',
            templateUrl: templateUrl('page/user/myaccount.html')
        })
        .state('frame.user', {
            url: '/user',
            templateUrl: templateUrl('page/user/user-home.html')
        })
        .state('frame.password', {
            url: '/password',
            templateUrl: templateUrl('page/user/password.html')
        })
        .state('frame.qrcode', {
            url: '/qrcode',
            templateUrl: templateUrl('page/user/user-qrcode.html')
        })

        //支付部分    
        .state('frame.myuserpoints', {
            url: '/myuserpoints',
            templateUrl: templateUrl('page/user/points-list-user.html')
        })
        .state('frame.myexpertpoints', {
            url: '/myexpertpoints',
            templateUrl: templateUrl('page/user/points-list-expert.html')
        })
        .state('frame.mypay', {
            url: '/mypay',
            templateUrl: templateUrl('page/user/mypay.html')
        })

        // --------------- 超级管理员 --------------
        .state('frame.recycle', {
            url: '/recycle',
            templateUrl: templateUrl('page/user/recycle.html')
        })
        .state('frame.roleright', {
            url: '/roleright',
            templateUrl: templateUrl('page/user/roleright.html')
        })
        .state('frame.sendmessage', {
            url: '/sendmessage',
            templateUrl: templateUrl('page/user/sendmessage.html')
        })

        // --------------- 资金管理部分 --------------
        .state('frame.qgsaccount', {
            url: '/qgsaccount',
            templateUrl: templateUrl('page/user/qgsaccount.html')
        })
        .state('frame.payexpertlist', {
            url: '/payexpertlist',
            templateUrl: templateUrl('page/user/payexpertlist.html')
        })
        .state('frame.payexpert', {
            url: '/payexpert',
            templateUrl: templateUrl('page/user/payexpert.html')
        })
        ;
    // catch all route
    // send users to the form page 
      
    $urlRouterProvider.otherwise("frame/myaccount");
}]);

function CTRL(ctrlName, fn){
  myapp.controller(ctrlName, ['$scope', '$rootScope', '$state', fn]);
}


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          用户信息                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
myapp.directive('userinfo', function() {
  return {
    restrict:'E',
    templateUrl:'user/box-user-info.html'
  };
});
  

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          搜索                                        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("QuickSearchCtrl", function($scope) {
  function quicksearch() {
    var quicksearchtext = $("#quicksearchtext").val();
    window.location.href = "#/frame/search?text=" + $scope.quicksearchtext;
  }
  $scope.quicksearchtext = GetQueryString("text");
  $scope.quicksearch = quicksearch;
})



// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          推送客服消息                                ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("SendMessageCtrl", function ($scope) {
  API.module = "service";
  var D = $scope.D = {
    tabs: ["发送文本", "发送文章"],
    active: "发送文本",
    click: function(tab){
      D.active = tab;
      SEND.prompt = "";
    }
  }
  var inputusers = $scope.inputusers = {
    users: []
  }
  $scope.syncnewsmsg = {
    value:"刷新",
    fn_suretext:function(){
      return ["正在同步微信服务器......"]
    },
    fn_canshow: function(scope, sure_dlg){
      API.get("/wx/syncnewslist", {}, {
        success:function(json){
          sure_dlg.settext("已更新");
          sure_dlg.btns = [];
          scope.$apply();
          window.setTimeout(function(){
            sure_dlg.showing = false;
            scope.$apply();
          }, 500);
        }
      });
      return true;
    }
  }
  
  var SEND = $scope.SEND = {
    //群发用户数据：
    touser    : false,
    toexpert  : false,
    toservice : false,
    toguest   : false,
    totest    : false,
    touserlist: false,
    usergroup: function(post){
      post.togroup = {};
      SEND.touser    && (post.togroup.user    = 1);
      SEND.toexpert  && (post.togroup.expert  = 1);
      SEND.toservice && (post.togroup.service = 1);
      SEND.toguest   && (post.togroup.guest   = 1);
      SEND.totest    && (post.togroup.test    = 1);
      if(SEND.touserlist){
        for(var i in $scope.inputusers.users){
          !post.togroup.userlist && (post.togroup.userlist=[]);
          post.togroup.userlist.push($scope.inputusers.users[i].id);
        }
      }
      return post;
    },
    has_group: function(){return SEND.touser || SEND.toexpert || SEND.toservice || SEND.toguest || SEND.totest;},
    has_pointuser: function(){ return SEND.touserlist && $scope.inputusers.users.length>0; },
    has_user: function(){return SEND.has_group() || SEND.has_pointuser();},
    //文本消息数据：
    text: "",
    //图文选择数据：
    activenews: false,
    selectnews: function(news){
      SEND.activenews = news;
    },

    //发送文本：
    sendtext:{
      value:"发送消息",
      fn_suretext:function(){
        return ["你确认要向所选用户发送消息？"]
      },
      fn_canshow: function(){
        if(SEND.has_group()){
          API.alert("选择群组后，只允许使用接口发送。");
          return false;
        }
        if(!SEND.has_pointuser()){
          API.alert("未指定用户。");
          return false;
        }
        if(!(SEND.text = SEND.text.trim())){
          API.alert("消息正文不能为空。");
          return false;
        }
        SEND.prompt = "";
        return true;
      },
      sure: function(scope, sure_dlg){
        API.post("/wx/sendtext", SEND.usergroup({text: SEND.text}), {
          success: function(json){
            if( json.errcode == 0){
              if(json.failed && json.failed.length>0){
                for(var i in json.success){
                  inputusers.deleteuser({id: json.success[i]})
                }
                API.alert(json.failed.length + "位用户发送失败，现保留在用户列表中。<br><br>你可以尝试用“群发”方式来发送。<br><br>(注：整站每天累计限100次)");
                SEND.prompt = json.success.length + "位用户发送成功，" + json.failed.length + "位用户发送失败。";
                $scope.$apply();
              }
              else{
                API.alert("发送成功");
                SEND.prompt = "发送成功。";
                $scope.$apply();
              }
            }
            else{
              API.alert(json.errmsg + "<br><br>你可以尝试用“群发”方式来发送。(注：整站每天累计限100次)");
              SEND.prompt = json.errmsg + "<br><br>你可以尝试用“群发”方式来发送。(注：整站每天累计限100次)";
              $scope.$apply();
            }
          }
        });
      }
    },
    //使用API推送文本：
    sendtextbyapi:{
      value:"用接口推送",
      fn_suretext:function(){
        return ["接口推送功能每天累计仅可使用100次","每个用户每天仅可接收4条","你确认要发送消息？"]
      },
      fn_canshow: function(){
        if(!SEND.has_user()){
          SEND.prompt = "未选择用户";
          return false;
        }
        if(!(SEND.text = SEND.text.trim())){
          SEND.prompt = "消息正文不能为空";
          return false;
        }
        SEND.prompt = "";
        return true;
      },
      sure: function(scope, sure_dlg){
        API.post("/wx/sendtextbyapi", SEND.usergroup({text: SEND.text}), {
          success: function(json){
            if( json.errcode == 0){
              SEND.prompt = "推送消息成功！";
              $scope.$apply();
            }
            else{
              SEND.prompt = json.errmsg;
              $scope.$apply();
            }
          }
        });
      }
    },
    //发送图文消息：
    sendnews:{
      value:"发送消息",
      fn_suretext:function(){
        return ["你确认要向所选用户发送图文消息？"]
      },
      fn_canshow: function(){
        if(SEND.has_group()){
          API.alert("选择群组后，只允许使用接口发送。");
          return false;
        }
        if(!SEND.has_pointuser()){
          SEND.prompt = "未指定用户";
          return false;
        }
        if(!SEND.activenews){
          SEND.prompt = "请选择一条图文消息";
          return false;
        }
        SEND.prompt = "";
        return true;
      },
      sure: function(scope, sure_dlg){
        API.post("/wx/sendnews", SEND.usergroup({newsid: SEND.activenews.id}), {
          success: function(json){
            if( json.errcode == 0){
              if(json.failed && json.failed.length>0){
                for(var i in json.success){
                  inputusers.deleteuser({id: json.success[i]})
                }
                API.alert(json.failed.length + "位用户发送失败，现保留在用户列表中。<br><br>你可以尝试用“群发”方式来发送。<br><br>(注：整站每天累计限100次)");
                SEND.prompt = json.success.length + "位用户发送成功，" + json.failed.length + "位用户发送失败。";
                $scope.$apply();
              }
              else{
                API.alert("发送成功");
                SEND.prompt = "发送成功。";
                $scope.$apply();
              }
            }
            else{
              API.alert(json.errmsg + "<br><br>你可以尝试用“群发”方式来发送。(注：整站每天累计限100次)");
              SEND.prompt = json.errmsg + "<br><br>你可以尝试用“群发”方式来发送。(注：整站每天累计限100次)";
              $scope.$apply();
            }
          }
        });
      }
    },
    //使用API推送图文消息：
    sendnewsbyapi:{
      value:"用接口推送",
      fn_suretext:function(){
        return ["接口推送功能每天累计仅可使用100次","每个用户每天仅可接收4条","你确认要推送消息？"]
      },
      fn_canshow: function(){
        if(!SEND.has_user()){
          SEND.prompt = "未选择用户";
          return false;
        }
        if(!SEND.activenews){
          SEND.prompt = "请选择一条图文消息";
          return false;
        }
        SEND.prompt = "";
        return true;
      },
      sure: function(scope, sure_dlg){
        API.post("/wx/sendnewsbyapi", SEND.usergroup({newsid: SEND.activenews.id}), {
          success: function(json){
            if( json.errcode == 0){
              SEND.prompt = "推送消息成功！";
              $scope.$apply();
            }
            else{
              SEND.prompt = json.errmsg;
              $scope.$apply();
            }
          }
        });
      }
    },

    news:{
      D:{
        pagesize: 6,
        baseAPI: "/wx/getnewslist"
      }
    }
  }
  //直接读取公众号文章列表：
  InitSmartPage($scope, SEND.news.D);
})

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          用户活跃度                                  ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("UserTraceCtrl", function ($scope) {
  API.module = "service";
  var userid = toNumber(GetQueryString("userid"));
  $scope.D = {
    pagesize:15, 
    sublist: [{en:"a", cn:"a"}],
    post:{userid: userid},
    baseurl: "#/frame/usertrace?userid=" + userid,
    baseAPI: "/user/gettrace",
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
})

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          用户管理                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

//  用户列表 
CTRL("UserListCtrl", function ($scope) {
  API.module = "service";
  function reget(){
    var sublist = [];
    API.hasallright(["激活用户", "激活专家", "激活编导"]) && (sublist.push({en:"qa", cn:"全部用户"}));
    API.hassomeright(["激活用户", "激活专家", "激活编导"]) && (sublist.push({en:"newuser", cn:"新注册"}));
    API.hasright("激活用户") && (sublist.push({en:"activeuser", cn:"用户"}));
    API.hasright("激活专家") && (sublist.push({en:"activeexpert", cn:"专家"}));
    API.hasright("激活编导") && (sublist.push({en:"activeservice", cn:"编导"}));
    var D = $scope.D = {
      hash_data: "UserListCtrl",
      pagesize: 8,
      savehash: true,
      sublist: sublist,
      baseurl: "#/frame/userlist",
      baseAPI: "/user/getlist",
      defaultlist: 0,
      post:{page: 0, sortby:""},
      searchtext:"",
      search: function(){
        D.post.searchtext = D.searchtext;
        D.post.page = 0;
        D.gotopage(D.post.page);
      },
      sortby: function(text){
        D.post.sortby = text;
        D.post.page = 0;
        D.gotopage(D.post.page);
      },
      delete_user: function(user){
        API.post("/user/deleteuser", {userid: user.id}, {
          success: function(json){
            D.gotopage(D.post.page);
          }
        });
      }
    }
    InitSmartPage($scope, $scope.D);
  }
  API.$scope.reget(function(){
    reget();
  });
})

// 编导设置用户信息 
CTRL("ServiceEditUserCtrl", function ($scope, $rootScope, $state) {
  API.module = "service";
  $scope.userinfo = {};
  $scope.nexturl = $state.current.name == "frame.usershow" ? "usershow2" : "usershow";
  
  var userid = toNumber(GetQueryString("userid"));
  API.get("/user/servicegetuser", {userid: userid}, { success: function( json){
    if(json.errcode !== 0)return;//请求返回错误
    $scope.userinfo = json.userinfo;
    $scope.controller = {
      userid: json.userinfo.id,
      name      : json.userinfo.name,
      company   : json.userinfo.company,
      department: json.userinfo.department,
      position  : json.userinfo.position,
      mobile    : json.userinfo.mobile,
      office    : json.userinfo.office,
      serviceEdit: json.userinfo.serviceEdit || {}
    }
    $scope.serviceEdit = $scope.controller.serviceEdit;
    $scope.options = json.userinfo.options ||{};
    if(json.userinfo.parentid) {
      servicegetreferrer();
    }
    $scope.$apply();
    $("body").scrollTop(0);//页面滚动到顶部
  }});
  
  var payexpert = $scope.payexpert = {
    payType: {
      value: "",
      defaultText: "分类",
      list: ["回答", "裁判", "推广", "支持"]
    },
    money: "",
    prompt: "输入发放金额",
    pay:function(){
      payexpert.money = toNumber(payexpert.money) || '';
      if(payexpert.money <= 0){
        API.alert("发放金额应大于0");
        return;
      }
      if(!payexpert.payType.value){
        API.alert("请选择酬金分类");
        return;
      }
      API.confirm("即将向专家 " + $scope.userinfo.name + " 发放酬金：<br><br><h4 class='text-center fee'>分类："+ payexpert.payType.value +"</h4><br><h4 class='text-center fee'>金额："+ payexpert.money +"元</h4><br>", function(){
        API.post("/qgs/dopayexpertsingle", {userid: $scope.userinfo.id, type: payexpert.payType.value, money: payexpert.money }, {
          success: function(json){
            if(json.errcode != 0){
              payexpert.money = "";
              payexpert.prompt = json.errmsg;
              $scope.$apply();
            }
            else{
              payexpert.money = "";
              payexpert.prompt = "发放成功";
              $scope.userinfo.expertpoints -= payexpert.money; //为什么不生效？
              $scope.$apply();
            }
          }
        });
      });
    }
  }  
    
  
  $scope.activeuser = function(module){
    API.get("/user/activeuser", {userid: $scope.userinfo.id, usermodule: module}, { success: function( json){
      if(json.errcode !== 0)return;//请求返回错误
      $scope.userinfo[module+'state'] = 3;
      $scope.$apply();
    }});
  }
  
  $scope.unactiveuser = function(module){
    API.get("/user/unactiveuser", {userid: $scope.userinfo.id, usermodule: module}, { success: function( json){
      if(json.errcode !== 0)return;//请求返回错误
      $scope.userinfo[module+'state'] = 2;
      $scope.$apply();
    }});
  }
  
  function btn(cn1, cn2, fn, en){
    return {
      value: cn1 + cn2,
      fn_suretext:function(){
        return ["你确认要"+cn1+"该用户的"+cn2+"功能？"]
      },
      sure: function(){ $scope[fn](en); }
    }
  }
  var DD = $scope.DD ={
    activeuser     : btn("激活","用户","activeuser"  , "user"   ),
    unactiveuser   : btn("停止","用户","unactiveuser", "user"   ),
    activeexpert   : btn("激活","专家","activeuser"  , "expert" ),
    unactiveexpert : btn("停止","专家","unactiveuser", "expert" ),
    activeservice  : btn("激活","编导","activeuser"  , "service"),
    unactiveservice: btn("停止","编导","unactiveuser", "service")
  }
  
  $scope.save_user_data = function(){
    
  }
  $scope.btn_save = {
    text: '保存',
    responsing: '正在保存...',
    saving: false,
    click: function(){
      if($scope.btn_save.saving) return;
      $scope.btn_save.saving = true;
      API.post("/user/serviceupdateuser", $scope.controller, {
        success: function(json) {
          if(json.errcode == 0){
            $scope.btn_save.saving = false;
            API.alert("已保存");
            $scope.$apply();
          }
        }
      });
    }
  }

  function servicegetreferrer(){
    API.get("/user/servicegetreferrer", {userid: userid}, {
      success: function(json){
        if(json.errcode == 0){
          $scope.referrer = json.referrer;
          $scope.$apply();
        }
      }
    });
  }  
  
  var RR = $scope.RR = {
    referrer: {
      value:"关联该ID",
      id: 0,
      fn_suretext:function(){
        return ["你确认要设置该用户的关联人？"]
      },
      fn_canshow: function(){
        if(!RR.referrer.id){
          RR.referrer.prompt = "关联人id无效";
          //$scope.$apply();
          return false;
        }
        RR.referrer.prompt = "";
        //$scope.$apply();
        return true;
      },
      n: 2,
      sure: function(){
        API.post("/user/serviceupdateuseroptions", {userid: userid, field: "referrer", value: RR.referrer.id}, {
          success: function(json){
            if( json.errcode == 0){
              //ServiceReadReferrerControl($scope);
              servicegetreferrer(userid);
              RR.referrer.prompt = "设置关联人成功！";
              $scope.$apply();
              window.setTimeout(function(){
                RR.referrer.prompt = "";
                $scope.$apply();
              }, 3000);
            }
            else{
              RR.referrer.prompt = json.errmsg;
              $scope.$apply();
            }
          }
        });
      }
    }
  }
})

// 编导设置用户的角色和权限 
CTRL("ServiceEditUserRoleRightCtrl", function ($scope) {
  API.module = "service";
  var userid = toNumber(GetQueryString("userid"));
  API.post("/user/servicegetarray", {data: {rights: 1, roles: 1, user:{id: userid, sub:["jbxx","rights"]}}}, {
    success: function( json){
      if(json.errcode !== 0)return;//请求返回错误
      var D =$scope.D = json.D;
      !D.user.rights && (D.user.rights=[]);
      $scope.user = json.D.user.jbxx;
      init();
      $scope.$apply();
    }
  });
  function init(){
    var D = $scope.D;
    D.roles.splice(0,0, {name:"全部", rights: D.rights});
    //显示是否有权限
    $scope.hasrights = [];
    var str = D.user.rights.join(",");
    for(var i in D.rights)$scope.hasrights[i] = str.indexOf(D.rights[i])>=0;
    //显示全部权限
    $scope.showrights = [];
    for(var i in D.rights)$scope.showrights[i] = true;
    check_roles();
    $scope.activerole = D.roles[0];
  }
  //检查各角色的状态
  function check_roles(){
    var D = $scope.D;
    var b = {};
    for(var i in D.rights)b[D.rights[i]] = $scope.hasrights[i];
    function get_yn(role){
      var y=0, n=0;
      for(var i in role.rights){
        if(b[role.rights[i]])y=1;
        else n=1;
        if(y && n)return "yn";
      }
      return y && "y" || "n"
    }
    for(var i in D.roles)D.roles[i].yn = get_yn(D.roles[i]);
  }
  $scope.rights_changed = false;
  $scope.click_right =function(index){
    $scope.hasrights[index] = !$scope.hasrights[index];
    $scope.rights_changed = true;
    check_roles();
  }
  $scope.save = function(){
    API.confirm("确定要更改该用户的权限？", function(){
      if(!$scope.rights_changed) return;
      //保存权限：
      var rights = [];
      for(var i in $scope.hasrights)if($scope.hasrights[i])rights.push($scope.D.rights[i]);
      API.post("/user/saveuserright", {user:{id: userid, rights: rights}}, {
        success: function(json){
          if(json.errcode == 0){
            $scope.rights_changed = false;
            $scope.prompt = "保存成功";
            $scope.$apply();
            window.setTimeout(function(){$scope.prompt = "";$scope.$apply();}, 3000);
            //RR.rights = json.rights;
            //RR.showinguser = (RR.rights && RR.rights[0]) || {rights:[]};//显示第一行用户
          }
        }
      });
    });
  }
  $scope.set_role =function(role){
    $scope.activerole = role;
    var D = $scope.D;
    //是否要显示这个权限
    $scope.showrights = [];
    var str = role.rights.join(",");
    for(var i in D.rights)$scope.showrights[i] = str.indexOf(D.rights[i])>=0;
  }
  
})
// 角色管理
CTRL("ServiceRoleAdminCtrl", function ($scope) {
  API.module = "service";
  var D;
  API.post("/user/servicegetarray", {data: {rights: 1, roles: 1}}, {
    success: function( json){
      if(json.errcode !== 0)return;//请求返回错误
      D =$scope.D = json.D;
      if(!D.roles || !D.roles.length)D.roles = [];
      $scope.$apply();
    }
  });
  $scope.set_role =function(role){
    $scope.activerole = role;
    $scope.rolename = role.name;
    $scope.adding = false;
    //是否要显示这个权限
    $scope.hasrights = [];
    var str = role.rights.join(",");
    for(var i in D.rights)$scope.hasrights[i] = str.indexOf(D.rights[i])>=0;
  };
  $scope.adding = true;
  $scope.add_role =function(){
    if($scope.adding){
      $scope.activerole = {name: $scope.rolename, rights:[]};
      D.roles.push($scope.activerole);
      $scope.adding = false;
      //添加角色：
      API.post("/user/addrole", {name: $scope.rolename}, {
        success: function(json){
          $scope.hasrights = [];
        }
      });
    }
    else{
      $scope.adding = true;
      $scope.rolename = "";
      $scope.activerole = false;
      $scope.hasrights = [];
    }
  }
  $scope.delete_role =function(){
    API.confirm("确定要删除这个角色？", function(){
      for(var i in D.roles)if(D.roles[i] == $scope.activerole){
        D.roles.splice(i, 1);
        //删除角色
        API.post("/user/deleterole", {name: $scope.rolename}, {
          success: function(json){
          }
        });
      }
    });
  }
  $scope.rename_role =function(){
    //更改名称
    API.post("/user/renamerole", {name: $scope.activerole.name, newname: $scope.rolename}, {
      success: function(json){
      }
    });
    $scope.activerole.name = $scope.rolename;
  }
  $scope.click_right =function(index){
    $scope.hasrights[index] = !$scope.hasrights[index];
    //保存角色：
    $scope.activerole.rights = [];
    for(var i in $scope.hasrights)if($scope.hasrights[i])$scope.activerole.rights.push($scope.D.rights[i]);
    API.post("/user/saverole", $scope.activerole, {
      success: function(json){
        if(json.errcode == 0){
          //RR.rights = json.rights;
          //RR.showinguser = (RR.rights && RR.rights[0]) || {rights:[]};//显示第一行用户
        }
      }
    });
  }
  
})

// 编导设置用户其它选项 
CTRL("ServiceEditUserOptionsCtrl", function ($scope) {
  API.module = "service";
  var userid = toNumber(GetQueryString("userid"));
  API.get("/user/servicegetuser", {userid: userid}, { success: function( json){
    if(json.errcode !== 0)return;//请求返回错误
    $scope.userinfo = json.userinfo;
    $scope.options = json.userinfo.options ||{};
    RR.referrer.id = $scope.options.referrer = toNumber($scope.options.referrer);//转换为整数
    $scope.options.alwaysrecivesq = $scope.options.alwaysrecivesq=="true";
    //ServiceReadReferrerControl($scope);
    servicegetreferrer(RR.referrer.id);
    $scope.$apply();
  }});
  
  function servicegetreferrer(){
    API.get("/user/servicegetreferrer", {userid: userid}, {
      success: function(json){
        if(json.errcode == 0){
          $scope.referrer = json.referrer;
          $scope.$apply();
        }
      }
    });
  }
  
  
  $scope.changeoptions = function(field){
    API.post("/user/serviceupdateuseroptions", {userid: userid, field: field, value:$scope.options[field]}, {
      success: function(json){
        if(json.errcode == 0){
        }
      }
    });
  }
  
  //赠送积分
  var send = $scope.send = {
    userpoints: {
      value:"赠送用户积分",
      fn_suretext: function(){
        return ["你确认要给该用户赠送 " + send.userpoints.n+" 用户积分？"]
      },
      fn_canshow: function(){
        return true//send.userpoints.n > 0
      },
      n: 2,
      sure: function(){
        API.post("/user/senduserpoints", {userid: userid, n: send.userpoints.n}, {
          success: function(json){
          }
        });
      }
    },
    expertpoints: {
      value:"赠送专家积分",
      fn_suretext:function(){
        return ["你确认要给该用户赠送 " + send.expertpoints.n+" 专家积分？"]
      },
      fn_canshow: function(){
        return true//send.expertpoints.n > 0
      },
      n: 2,
      sure: function(){
        API.post("/user/sendexpertpoints", {userid: userid, n: send.expertpoints.n}, {
          success: function(json){
          }
        });
      }
    }
  }
  var RR = $scope.RR = {
    resetpassword: {
      value:"重置密码",
      p1: "",
      p2: "",
      fn_suretext:function(){
        return ["你确认要重置该用户的密码？"]
      },
      fn_canshow: function(){
        if(RR.resetpassword.p1 != RR.resetpassword.p2){
          RR.resetpassword.prompt = "两次密码输入不一致";
          //$scope.$apply();
          return false;
        }
        RR.resetpassword.prompt = "";
        //$scope.$apply();
        return true;
      },
      n: 2,
      sure: function(){
        API.post("/user/servicechangepassword", {userid: userid, p1: MD5(RR.resetpassword.p1+"@qgs")}, {
          success: function(json){
            if( json.errcode == 0){
              RR.resetpassword.p1 = RR.resetpassword.p2="";
              RR.resetpassword.prompt = "密码重置成功！";
              $scope.$apply();
            }
            else{
              RR.resetpassword.prompt = json.errmsg;
              $scope.$apply();
            }
          }
        });
      }
    },
    referrer: {
      value:"关联该ID",
      id: 0,
      fn_suretext:function(){
        return ["你确认要设置该用户的关联人？"]
      },
      fn_canshow: function(){
        if(!RR.referrer.id){
          RR.referrer.prompt = "关联人id无效";
          //$scope.$apply();
          return false;
        }
        RR.referrer.prompt = "";
        //$scope.$apply();
        return true;
      },
      n: 2,
      sure: function(){
        API.post("/user/serviceupdateuseroptions", {userid: userid, field: "referrer", value: RR.referrer.id}, {
          success: function(json){
            if( json.errcode == 0){
              //ServiceReadReferrerControl($scope);
              servicegetreferrer(userid);
              RR.referrer.prompt = "设置关联人成功！";
              $scope.$apply();
              window.setTimeout(function(){
                RR.referrer.prompt = "";
                $scope.$apply();
              }, 3000);
            }
            else{
              RR.referrer.prompt = json.errmsg;
              $scope.$apply();
            }
          }
        });
      }
    }
  }
})


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          资金管理                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

//  充值列表 
CTRL("QgsAccountCtrl", function ($scope) {
  API.module = "service";
  $scope.D = {
    pagesize: 8, 
    sublist: [
        {en:"cashlist", cn:"充值记录"}],
    baseurl: "#/frame/qgsaccount",
    baseAPI: "/qgs/getcashlist",
    onsuccess: function(json){
      for(var i=0; i<json.list.length; i++){
        json.list[i].n = money(json.list[i].n);
        //var s = json.list[i].time_end + "";
        //json.list[i].time_end = s.substring(0,4)+"-"+s.substring(4,6)+"-"+s.substring(6,8)+" "+s.substring(8,10)+":"+s.substring(10,12)+":"+s.substring(12,14);
      }
    },
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
})
//  酬金发放记录 
CTRL("QgsPayExpertPointsCtrl", function ($scope) {
  API.module = "service";
  $scope.D = {
    pagesize: 8, 
    sublist: [
        {en:"cashlist", cn:"充值记录"}],
    baseurl: "#/frame/qgsaccount",
    baseAPI: "/qgs/getpayexpertpointslist",
    onsuccess: function(json){
      for(var i=0; i<json.list.length; i++){
        json.list[i].n = money(json.list[i].n);
      }
    },
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
})

//  发放专家酬金
CTRL("PayExpertCtrl", function ($scope) {
  API.module = "service";
  
  var PAY = $scope.PAY = {
    payall: false,
    payuserlist: false,
    till: "lastmonth",//默认发放到上月底
    maxpay:{ n:0, totle:0},
    listpay:{ n:0, totle:0},
    clickpayall: function(){
      window.setTimeout(function(){
        PAY.payuserlist = PAY.payuserlist && !PAY.payall;
        $scope.$apply();
      },10);
    },
    clickpayuserlist: function(){
      window.setTimeout(function(){
        PAY.payall = PAY.payall && !PAY.payuserlist;
        $scope.$apply();
      },10);
    },
    beginpay: function(){
      if(!PAY.payall && (!PAY.payuserlist || inputusers.users.length <= 0))API.alert("未选择待发放酬金的专家");//在模板中已限制了，再限制也无妨。

      var info = PAY.payall ? PAY.maxpay : PAY.listpay;
      API.confirm("即将发放专家酬金：<br><br><h5 class='text-center'>共"+ info.n +"位专家，合计金额："+ info.totle +"元</h5><br>", function(){
        var post = {till: PAY.till, info: info};
        if(PAY.payuserlist){
          post.users = [];
          for(var i in inputusers.users)post.users.push(inputusers.users[i].id);
        }
        else post.users = "all";
        API.post("/qgs/dopayexpert", post, {
          success: function(json){
            PAY.maxpay.n = json.n;
            PAY.maxpay.totle = json.totle;
            $scope.$apply();
          }
        });
      });
    }
  }
  API.post("/qgs/getpayexpertinfo", {till: PAY.till}, {
    success: function(json){
      PAY.maxpay = json;
      $scope.$apply();
    }
  });
  var inputusers = $scope.inputusers = {
    baseAPI: "/qgs/getpayexpertlist",
    users: [],
    post: {till: PAY.till},
    change: function(user){
      PAY.listpay.n = inputusers.users.length;
      PAY.listpay.totle = 0;
      for(var i in inputusers.users)PAY.listpay.totle += toNumber(inputusers.users[i].expertpoints);
    }
  }
})

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          回收站                                      ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
CTRL("RecycleCtrl", function ($scope) {
  API.module = "service";
  var D = $scope.D = {
    hash_data: "RecycleCtrl",
    pagesize: 8,
    savehash: true,
    sublist: [
        {en:"user", cn:"用户"}, 
        {en:"qa", cn:"问答"}, 
        {en:"bbs", cn:"论坛"}, 
        {en:"kl", cn:"知识库"} ],
    baseAPI: "/user/getrecyclelist",
    defaultlist: 0,
    post:{page: 0, sortby:""},
    searchtext:"",
    search: function(){
      D.post.searchtext = D.searchtext;
      D.post.page = 0;
      D.gotopage(D.post.page);
    },
    sortby: function(text){
      D.post.sortby = text;
      D.post.page = 0;
      D.gotopage(D.post.page);
    },
    undelete: function(item){
      API.post("/user/undelete", {en:D.en, id: item.id}, {
        success: function(json){
          D.gotopage(D.post.page);
        }
      });
    }
  }
  InitSmartPage($scope, $scope.D);
})
/***********************************
 * 用户磁贴表
 * 
 * 
 * 
*************************************/
myapp.directive('usericons', function() {
  return {
    restrict:'E',
    templateUrl:'user/usericons.html'
  };
});

CTRL("UserIconsController", function($scope) {
  $scope.icons=[];
  
  var list = {
    "qa-service": ["all","new","toanswer","tosatisfy","tofile"]
  };

  API.$scope.reget(function(json){
    API.post("/user/todocounts", {list: list}, {
      success: function( json){
        if(json.errcode==0){
          API.todocounts = json.nn;
        }
        $scope.$apply();
      }
    });
    init_menu();
  });
  
  function init_menu(){
    if(!API.service_menu)API.service_menu = [
      { show: "cols",
        title: "问答管理",
        sub:[
          {text:"新提问"  , href:"#/frame/qa?en=new&page=1"      , right:"问答管理", n:["qa-service","new"      ], icon:"glyphicon glyphicon-question-sign fee"},
          {text:"已回答"  , href:"#/frame/qa?en=tosatisfy&page=1", right:"问答管理", n:["qa-service","tosatisfy"], icon:"glyphicon glyphicon-question-sign"},
          {text:"已评价"  , href:"#/frame/qa?en=tofile&page=1"   , right:"问答管理", n:["qa-service","tofile"   ], icon:"glyphicon glyphicon-question-sign color-008"},
          {text:"快速抢答", href:"#/frame/qa?en=sqallanswering"  , right:"问答管理",                               icon:"glyphicon glyphicon-plane text-danger"},
        ]},
      { show: "rows",
        sub:[
          {text:"资金账户"    , href:"#/frame/qgsaccount"   , right:"查看充值记录", icon:"glyphicon glyphicon-tree-deciduous icon fee"},
          {text:"发放专家酬金", href:"#/frame/payexpert"    , right:"发放专家酬金", icon:"glyphicon glyphicon-tree-deciduous icon fee"},
          {text:"酬金发放记录", href:"#/frame/payexpertlist", right:"发放专家酬金", icon:"glyphicon glyphicon-tree-deciduous icon fee"},
          {text:"消息推送"    , href:"#/frame/sendmessage"  , right:"推送消息"    , icon:"glyphicon glyphicon-tree-deciduous icon fee"},
        ]},
      { show: "rows",
        sub:[
          {text:"新用户", href:"#/frame/userlist?en=newuser"       , right:"激活用户"   , icon:"glyphicon glyphicon-user icon fee"},
          {text:"专家"  , href:"#/frame/userlist?en=activeexpert"  , right:"激活专家"   , icon:"glyphicon glyphicon-tower color-080"},
          {text:"编导"  , href:"#/frame/userlist?en=activeservice" , right:"激活编导"   , icon:"glyphicon glyphicon-glass color-080"},
          {text:"专家库", href:"#/frame/expert"                    , right:"管理专家库" , icon:"glyphicon glyphicon-tower icon color-008"}
        ]},
      { show: "rows",
        sub:[
          {text:"论坛管理", href:"#/frame/bbs-list-service", right:"论坛管理"  , icon:"fa fa-user fa-fw hh4"},
          {text:"知识库"  , href:"#/frame/kl-list"         , right:"管理知识库", icon:"glyphicon glyphicon-book icon color-00f"}
        ]},
      { show: "rows",
        sub:[
          {text:"回收站"      , href:"#/frame/recycle"         , right:"回收站"      , icon:"fa fa-trash fa-fw hh4"},
          {text:"角色权限管理", href:"#/frame/role-admin", right:"角色权限管理", icon:"glyphicon glyphicon-thumbs-up icon color-080"}
        ]}
    ];
    var MENU = $scope.MENU = [];
    for(var i in API.service_menu){
      var sub = [];
      for(var j in API.service_menu[i].sub){
        if(API.hasright(API.service_menu[i].sub[j].right))sub.push(API.service_menu[i].sub[j]);
      }
      if(sub.length > 0)MENU.push({show: API.service_menu[i].show, title: API.service_menu[i].title, sub: sub});
    }
  }
});

