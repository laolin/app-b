
CTRL("BbsHomeUserCtrl", function ($scope) {
  API.setmodule("user", "expert"); //允许用户和专家模块都可用，而不改变主菜单
})

CTRL("BbsNewCtrl", function ($scope) {
  API.setmodule("user", "expert"); //允许用户和专家模块都可用，而不改变主菜单
  var bbsid = 0;

  var BBS;
  API.get("/bbs/getbbsdraft", {}, {
    success: function(json){
      var attr = json.bbs.attr && initqa_attr($scope, json.bbs.attr) || {};
      InitCIA($scope, "BBS", { keyid:"bbsid", url: "/bbs/updatedraft"});
      BBS = $scope.BBS;
      BBS.controldata = {
        id: bbsid = json.bbs.id,
        bbsid: json.bbs.id,
        tags: attr.tags || "",
        content: attr.content || ""
      }
      BBS.images.list = attr.imageslist || [];//图像列表初始化
      BBS.audios.list = attr.audioslist || [];//录音列表初始化
      $scope.$apply();
    }
  });

  $scope.onsubmit = function(){
    if(BBS.controldata.content.length <3){
      tiperror("content", "帖子正文至少3个字符");
      return false;
    }
    API.confirm("您确定要发帖？", function(){
      API.post("/bbs/donebbsdraft", {bbsid: BBS.controldata.id}, {
        success: function(json){
          //window.setTimeout(function(){
            //API.alert("您的帖子已提交，等待管理员审核通过后将自动发布。", function(){
            API.alert("您的帖子已自动发布。", function(){
              window.location.href = "#/frame/bbs-show-user?bbsid=" + bbsid;
            });
            $scope.$apply();
          //}, 100);
        }
      });
    });
  }
})

CTRL("BbsListUserCtrl", function ($scope) {
  API.setmodule("user", "expert"); //允许用户和专家模块都可用，而不改变主菜单
  var en = GetQueryString("en");
  var sublist_bbs = [
        {en:"user-bbs-all",cn:"所有发帖"}, 
        {en:"user-unchecked",cn:"新帖"}, 
        {en:"user-unfiled",cn:"讨论中"}, 
        {en:"user-filed",cn:"已结帖"}];
  var sublist_follow = [
        {en:"user-followed",cn:"已回帖"}, 
        {en:"user-unfollowed",cn:"未回帖"},
        {en:"user-canfollow",cn:"可回帖"}];
  var sublist = sublist_bbs;
  for(var i in sublist_follow)if(sublist_follow[i].en == en){ sublist = sublist_follow; break; }
  var sublist = [
        {en:"user-all",cn:"全部"}, 
        {en:"user-bbs-all",cn:"我的论谈"}, 
        {en:"user-followed",cn:"我的回复"}]
  var sublist = [
        {en:"user-commend",cn:"系统推荐"}, 
        {en:"user-all",cn:"全部论谈"}, 
        {en:"user-followed",cn:"我参与的"}]
  var D = $scope.D = {
    hash_data: "BbsListUserCtrl",
    pagesize:8,
    pagebuttons:5,
    sublist: sublist,
    baseurl: "#/frame/bbs-list-user",
    baseAPI: "/bbs/getlist",
    defaultlist: 0,
    post:{page: 0},
    searchtext:"",
    search: function(){
      D.post.searchtext = D.searchtext;
      D.post.page = 0;
      D.gotopage(D.post.page);
    }
  }
  InitSmartPage($scope, $scope.D);
})

CTRL("BbsShowUserCtrl", function ($scope) {
  API.setmodule("user", "expert"); //允许用户和专家模块都可用，而不改变主菜单
  var bbsid = GetQueryString("bbsid");
  
  
  $scope.n_follow = 0;
  $scope.answer = function(index){
    $scope.n_follow = index + 1;
    $scope.following = true;
    window.setTimeout(function(){
      $("body").animate({scrollTop: $(".pos-follow")[0].offsetTop},500);
    }, 10);

  }
  $scope.reget = function(){
    API.get("/bbs/getdetail", {bbsid: bbsid}, {
      success: function(json){
        $scope.bbs = json.bbs;
        $scope.follows = json.follows;
        $scope.users = json.users;

        initbbs_attr($scope, json.bbs.attr);
        for(var i in $scope.follows)initbbs_attr($scope, $scope.follows[i].attr);
        $scope.$apply();
      }
    });
  }
  $scope.reget();

  //回帖功能：
  $scope.following = false;
  InitCIA($scope, "EDIT");
  var EDIT = $scope.EDIT;
  $scope.tofollow = function(){
    if(!EDIT.controldata || EDIT.controldata.content.length <3){
      tiperror("content", "回帖正文至少3个字符");
      return false;
    }
    API.confirm("您确定要回帖？", function(){
      API.post("/bbs/diredtfollow", {bbsid: bbsid, data: EDIT.controldata, n_follow: $scope.n_follow}, {
        success: function(json){
          InitCIA($scope, "EDIT");
          EDIT = $scope.EDIT;
          $scope.following = false;
          $scope.reget();
        }
      });
    });
  }
})





CTRL("BbsHomeServiceCtrl", function ($scope) {
  API.module = "service";
})

CTRL("BbsListServiceCtrl", function ($scope) {
  API.module = "service";
  var sublist = [
        {en:"service-commend",cn:"已推荐"}, 
        {en:"service-bbs-all",cn:"全部"}]
  var D = $scope.D = {
    hash_data: "BbsListServiceCtrl",
    pagesize:8,
    pagebuttons:5,
    sublist: sublist,
    baseurl: "#/frame/bbs-list-service",
    baseAPI: "/bbs/getlist",
    defaultlist: 0,
    post:{page: 0},
    searchtext:"",
    search: function(){
      D.post.searchtext = D.searchtext;
      D.post.page = 0;
      D.gotopage(D.post.page);
    },
    removedata: function(item){
      API.post("/user/removedata", {en:'bbs', id: item.id}, {
        success: function(json){
          D.gotopage(D.post.page);
        }
      });
    }
  }
  InitSmartPage($scope, $scope.D);
})

CTRL("BbsShowServiceCtrl", function ($scope) {
  var bbsid = GetQueryString("bbsid");
  API.module = "service";
  $scope.reget = function(){
    API.get("/bbs/getdetail", {bbsid: bbsid}, {
      success: function(json){
        $scope.bbs = json.bbs;
        $scope.follows = json.follows;
        $scope.users = json.users;

        initbbs_attr($scope, json.bbs.attr);
        for(var i in $scope.follows)initbbs_attr($scope, $scope.follows[i].attr);
        $scope.$apply();
      }
    });
  }
  $scope.reget();

  //审核发帖：
  $scope.checkbbs = function(){
    API.confirm("您确定审核发帖通过？", function(){
      API.post("/bbs/checkbbs", {bbsid: bbsid, state: '未结'}, {
        success: function(json){
          $scope.reget();
        }
      });
    });
  }

  //审核跟帖：
  $scope.checkfollow = function(item, state){
    API.confirm("您确定审核跟帖通过？", function(){
      API.post("/bbs/checkfollow", {followid: item.id, state: state}, {
        success: function(json){
          $scope.reget();
        }
      });
    });
  }

  //向所有用户推荐帖子：
  $scope.recommendtoall = function(){
    API.confirm("确定推荐后，将向所有已关注用户推送到图文消息。<br>您确定推荐本帖子？", function(){
      API.post("/bbs/recommendtoall", {bbsid: bbsid}, {
        success: function(json){
          API.alert(json.errcode && json.errmsg || "已提交成功！");
          $scope.bbs.rq_recommend = "2015-12-00";
          $scope.$apply();
        }
      });
    });
  }
  //取消推荐帖子：
  $scope.unrecommend = function(){
    API.confirm("确定要取消推荐本帖子？", function(){
      API.post("/bbs/unrecommend", {bbsid: bbsid}, {
        success: function(json){
          API.alert(json.errcode && json.errmsg || "已提交成功！");
          $scope.bbs.rq_recommend = false;
          $scope.$apply();
        }
      });
    });
  }
  //显示推荐历史记录：
  $scope.showrecommend = function(){
    var s = [];
    for(var i in $scope.bbs.attr.service_conmmend){
      var row = $scope.bbs.attr.service_conmmend[i];
      s.push(row.rq.substr(0,16) + " " + $scope.users[row.id].name + "：" + row.ac);
    }
    API.alert(s.join("<br>")+"<br><br>"); 
  }
})





function initbbs_attr($scope, attr){
  attr.contents = (attr.content||"").split("\n");//处理不能自动换行
  //初始化回答的图片：
  attr.imageslist = attr.images ? attr.images.split(",") : [];
  //初始化回答的录音：
  if(API.iswx && attr.audioslist)for(var i in attr.audioslist){
    //将录音的服务器ID转换为本地ID：
    audio_serverId_to_localId({scope: $scope, audio: attr.audioslist[i]});//异步执行
  }
  return attr;
}

myapp.directive('bbsItem', function() {
  return {
    restrict: 'AE',
    //transclude: true,
    templateUrl: templateUrl("page/bbs/tpl-bbs-item.html"),
    scope: {
      users: "=",
      item: "=",
      onmodify: "&",
      lou: "@"
    },
    link: function (scope, element, attrs) {
      scope.me = API.userinfo;
      if(!API.userinfo)API.$scope.reget(function(){scope.me = API.userinfo;});
      //修改功能：
      scope.modifying = false;
      var init_edit = function (scope){
        if(!scope.item)return;
        var EDIT = scope.EDIT = InitCIA(scope, "EDIT");
        EDIT.controldata = {
          content: scope.item.attr.content || ""
        }
        EDIT.images.list = scope.item.attr.imageslist || [];//图像列表初始化
        EDIT.audios.list = scope.item.attr.audioslist || [];//录音列表初始化
      }
      init_edit(scope);
      scope.$watch("item", function(a, b){
        var c = scope.item;
        scope.item = a;
        if(a)init_edit(scope);
      });
      scope.gotomodify = function (item){
        scope.item = item;
        init_edit(scope);
        scope.modifying = 1;
      }
      scope.tomodify = function(){
        var EDIT = scope.EDIT
        if(!EDIT.controldata || EDIT.controldata.content.length <3){
          show_prompt(scope, "正文至少3个字符", 3000);
          return false;
        }
        API.confirm("您确定要修改该帖子？", function(){
          API.post("/bbs/usermodify", {bbsid: scope.item.id, data: EDIT.controldata}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.modifying = false;
              scope.$apply();
              scope.onmodify();return;
              scope.item.attr.content = EDIT.controldata.content; 
              scope.item.attr.contents = EDIT.controldata.content.split("\n"); 
              scope.item.attr.imageslist = EDIT.images.list;//未完
              scope.item.attr.audioslist = EDIT.audios.list;
              scope.item.attr.modified   = 1;
              scope.modifying = false;
              scope.$apply();
            }
          });
        });
      }
      scope.gotodelete = function (item){
        API.confirm("您确定要删除该帖子？", function(){
          API.post("/bbs/userdelete", {bbsid: item.id}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.$apply();
              scope.onmodify();return;
              scope.item.rq_delete = "2015-12-00";
              scope.$apply();
            }
          });
        });
      }
      scope.gotoundelete = function (item){
        API.confirm("您确定要恢复该帖子？", function(){
          API.post("/bbs/userundelete", {bbsid: item.id}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.$apply();
              scope.onmodify();return;
              scope.item.rq_delete = false;
              scope.$apply();
            }
          });
        });
      }
    }
  };
});
myapp.directive('bbsItemService', function() {
  return {
    restrict: 'E',
    //transclude: true,
    templateUrl: templateUrl("page/bbs/tpl-bbs-item-service.html"),
    scope: {
      users: "=",
      item: "=",
      onmodify: "&",
      lou: "@"
    },
    link: function (scope, element, attrs) {
      //修改功能：
      scope.modifying = false;
      var init_edit = function (scope){
        if(!scope.item)return;
        var EDIT = scope.EDIT = InitCIA(scope, "EDIT");
        EDIT.controldata = {
          content: scope.item.attr.content || ""
        }
        EDIT.images.list = scope.item.attr.imageslist || [];//图像列表初始化
        EDIT.audios.list = scope.item.attr.audioslist || [];//录音列表初始化
      }
      init_edit(scope);
      scope.$watch("item", function(a, b){
        var c = scope.item;
        scope.item = a;
        if(a)init_edit(scope);
      });
      scope.tips = function (m){
        switch(m.ac){
          case "用户修改":
          case "编导修改":
            API.alert(
              m.ac + "(" + m.id+ (scope.users && scope.users[m.id] && (", "+scope.users[m.id].name) || "")+"):" +
              "<br>"+ m.rq.substr(0,16) +
              "<br>【原文】：<br>"+ m.olddata.content
            ); 
            return;
        }
      }
      scope.gotomodify = function (item){
        scope.item = item;
        init_edit(scope);
        scope.modifying = 1;
      }
      scope.tomodify = function(){
        var EDIT = scope.EDIT
        if(!EDIT.controldata || EDIT.controldata.content.length <3){
          show_prompt(scope, "正文至少3个字符", 3000);
          return false;
        }
        API.confirm("您确定要修改该帖子？", function(){
          API.post("/bbs/servicemodify", {bbsid: scope.item.id, data: EDIT.controldata}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.modifying = false;
              scope.$apply();
              scope.onmodify();return;
              scope.item.attr.content = EDIT.controldata.content; 
              scope.item.attr.contents = EDIT.controldata.content.split("\n"); 
              scope.item.attr.imageslist = EDIT.images.list;//未完
              scope.item.attr.audioslist = EDIT.audios.list;
              scope.item.attr.modified   = 1;
              scope.modifying = false;
              scope.$apply();
            }
          });
        });
      }
      scope.gotodelete = function (item){
        API.confirm("您确定要删除该帖子？", function(){
          API.post("/bbs/servicedelete", {bbsid: item.id}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.$apply();
              scope.onmodify();return;
              scope.item.rq_delete = "2015-12-00";
              scope.$apply();
            }
          });
        });
      }
      scope.gotoundelete = function (item){
        API.confirm("您确定要恢复该帖子？", function(){
          API.post("/bbs/serviceundelete", {bbsid: item.id}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.$apply();
              scope.onmodify();return;
              scope.item.rq_delete = false;
              scope.$apply();
            }
          });
        });
      }
    }
  };
});

function show_prompt(scope, prompt, delay){
  scope.prompt = prompt;
  if(delay >0)window.setTimeout(function(){
    scope.prompt = "";
    scope.$apply();
  }, delay);
}
