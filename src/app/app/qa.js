

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          问答录入库                                  ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

function InitCIA($scope, field, options){
  !options && (options = {});
  return InitDraftFunctions($scope, field, {
    keyid: options.keyid,
    draft:{
      url: options.url,
      success: function(json){ options.draft && options.draft.success && options.draft.success(json); }
    },
    content:{
      field:"content",
      maxchange:5  
    },
    image:{
      field: "images", 
      options:{ url: options.url, postfield:"wxappendimage"}
    },
    audio:{
      field: "audios", 
      options:{url: options.url, voiceAPI: "/wx/uploadvoice"}
    },
    controldata: options.controldata
  });
}

//options:
//    keyid: 保存草稿时，ajax中的key名
function InitDraftFunctions($scope, field, options){
  
  // 问答编辑模块支持
  var EDIT = $scope[field] = new CQaEdit($scope, options.keyid);

  // 保存草稿功能-------------
  EDIT.EnableDraft(options.draft);

  // 随时保存正文功能 -------------
  options.content && EDIT.AddContentWatch(options.content.field, options.content.maxchange);

  // 微信图片功能 ----------------
  options.image && EDIT.AddImageWatch(options.image.field, options.image.options);

  // 微信录音功能 ----------------
  options.audio && EDIT.AddVoiceWatch(options.audio.field, options.audio.options);

  EDIT.controldata = $scope.controldata = options.controldata;
  return EDIT;
}
function CQaEdit($scope, keyid){
  var self = this;
  self.controldata = {};
  self.onchange = {};
  self.onclick = {};
  self.state = {};
  
  self.getCIA = function(){
    return {
      content: self.controldata.content,
      images:  self.images.list.join(","),
      audios:  self.audios.get_data()
    }
  }
  //保存草稿功能
  //支持调用：EDIT.EnableDraft({url:'apiurl', success:function(json){...}});
  //使用(HTML)：ng-change="EDIT.updatedraft('field_xx')"
  this.EnableDraft = function(options){
    self.updatedraft = function(field) {
      if(!options.url)return;
      var canupdate = (!options.canupdate && true) || options.canupdate(field)!==false;
      if(!canupdate)return;
      var post = {field: field, value:self.controldata[field]};
      post[keyid] = self.controldata.id; //这一行怎么合并到上一行？
      API.post(options.url, post, {
        success: function(json){
          options.success && options.success(json);
        }
      });
    }
  }
  
  //文本框修改功能
  //支持调用：EDIT.AddContentWatch('answer', 5);
  //使用(HTML)：ng-change="EDIT.field_xx.onchange()" ng-blur="EDIT.field_xx.onchange.clear()" ng-model="EDIT.controldata.field_xx"
  this.AddContentWatch = function(field, maxchange){
    if(!self[field]) self[field] = {};
    var ctrl = self[field];
    ctrl.changed   = 0;
    ctrl.maxchange = maxchange || 5;
    ctrl.onchange  = function() {
      ctrl.changed ++;
      if(ctrl.changed > ctrl.maxchange){
        self.updatedraft(field);//保存草稿到服务器
        ctrl.changed = 0;
      }
    };
    ctrl.onblur = function() {
      if(ctrl.changed){
        self.updatedraft(field);//保存草稿到服务器
        ctrl.changed = 0;
      }
    }
  }
  
  //多级选择功能
  //支持调用：EDIT.AddMulitySelectWatch('major', SETTINGS.typetree, options);
  //options可接受四个参数(均可选)：
  //value    : 初始化值，字符串，各级值用,隔开
  //canedit  : 回调函数，表示允许点击事件？返回false不允许，不指定或返回其它值为允许，
  //canselect: 回调函数，表示允许点击某级某值？返回false不允许，不指定或返回其它值为允许，
  //change   : 回调函数，在点击完成后调用，不指定，则调用保存草稿功能（若有）
  //
  //使用(HTML)：
  //未展开处：ng-click="EDIT[field].onclick()" 
  //展开列表：ng-click="EDIT[field].onselect(1,itemtext)"
  //列表之外：ng-click="EDIT[field].hide()" 
  //重新赋值：EDIT[field].setvalue(value)  //value格式同options参数
  this.AddMulitySelectWatch = function(field, roottree, options){
    if(!self[field]) self[field] = {};
    var ctrl = self[field];
    
    ctrl.tree = [];
    ctrl.list = [];
    ctrl.value = [];
    ctrl.editing = false;
    
    //点击事件，正常情况要弹出框
    ctrl.onclick = function(){
      var canedit = (!options.canedit && true) || options.canedit(ctrl.editing)!==false;
      canedit && (ctrl.editing = !ctrl.editing);
    }
    //强制隐藏
    ctrl.hide = function() {
      ctrl.editing = false;
    }

    //第n级，选择值v
    ctrl.onselect = function(n, v) {
      var canselect = (!options.canselect && true) || options.canselect(n, v)!==false;
      if(!canselect) return;
      //保存数据
      ctrl.value[n] = v;
      //重新初始化下级
      inittree(n + 1, ctrl.tree[n][v]);
      //赋值：
      self.controldata[field] = ctrl.value.join(",");
      //事件通知
      options.change ? options.change(n, v, ctrl) //有指定修改后如何处理
        : (self.updatedraft && self.updatedraft(field));//没有指定修改后如何处理
    }
    
    function inittree(n, treedata, not_clearvalue){
      //这级的树
      ctrl.tree[n] = treedata || ctrl.tree[n-1][ctrl.value[n-1]];
      //这级的值置空
      !not_clearvalue && treedata && (ctrl.value[n] = "");
      //生成这级列表框：
      ctrl.list[n] = [];
      for(var k in treedata)ctrl.list[n].push(k);
    }
    
    //设定多选框各级值, str_value：数组， 或用逗号连接的字符串
    ctrl.setvalue = function(str_value){
      ctrl.value = (typeof str_value=='string' && ((str_value && str_value.split(",")) || [])) || str_value;
      for(var i in ctrl.value){
        if(!ctrl.value[i])break;
        i = toNumber(i);
        inittree(i+1, ctrl.tree[i][ctrl.value[i]], true);
      }
    }
    
    inittree(0, roottree);
    //如果要初始化：
    options.value && ctrl.setvalue(options.value);
  }
  
  // ---------------- 微信图片功能 ----------------
  //支持调用：EDIT.AddImageWatch('askimages', options);
  //options 需两个参数(必选)：
  //    url       : API调用地址，
  //    postfield : API调用时的参数名
  //
  //使用(HTML)： ng-click="EDIT[field].ongetimages()"  ng-click="EDIT[field].delimage(index, localId)"
  this.AddImageWatch = function(field, options){
    if(!self[field]) self[field] = {};
    var ctrl = self[field];
    
    ctrl.list = [];
    ctrl.setvalue = function(str_value){
      ctrl.list = (str_value && str_value.split(",")) || [];
    }

    /**
     * 新增, 用于新的图片上传组件
     */
    ctrl.updateValue = function(imgs){
      ctrl.list = imgs || [];
      self.controldata.images = ctrl.list.join(",");
      self.updatedraft("images");
    }
  }

  // ---------------- 微信录音功能 ----------------
  //支持调用：EDIT.AddVoiceWatch('kaudios', options);
  //初始化：要求一个含有服务端id的数组
  //
  //options 需两个必选参数(url、voiceAPI)和三个可选参数：
  // url      : API调用地址，
  // voiceAPI : 微信声音API调用地址，
  // onbeginrecord  : 回调函数，用户开始录音前调用
  // onstoprecord   : 回调函数，用户停止录音前调用
  // onendrecord    : 回调函数，录音停止前调用，包括用户停止、一分钟后自动停止
  //
  //使用(HTML)
  //    开始录音 ng-click="EDIT[field].onbeginrecord()" ng-show="!EDIT[field].recording"
  //    停止录音 ng-click="EDIT[field].onstoprecord()" ng-show="EDIT[field].recording"
  //    列表     ng-repeat="audio in EDIT[field].list" => {{audio.localId}}
  //    删除录音 ng-click="EDIT[field].delrecord($index)"
  this.AddVoiceWatch = function(field, options){
    if(!self[field]) self[field] = {};
    var ctrl = self[field];
    ctrl.recording = false;

    ctrl.list = [];
    ctrl.setvalue = function(arr_value){
      ctrl.list = arr_value || [];
      if(API.iswx)for(var i in ctrl.list){
        //将录音的服务器ID转换为本地ID（下载）：
        audio_serverId_to_localId({scope: $scope, audio: ctrl.list[i]});
      }
    }
    //更新草稿到服务器（因为每个声音保存文件名和本地ID）
    ctrl.get_data = function(){
      var urls = [];
      for(var i in ctrl.list){
        urls.push(ctrl.list[i].url);
      }
      return urls.join(",");
    }

    //删除
    ctrl.delrecord = function(index) {
      ctrl.list.splice(index, 1);
      ctrl.updatedraftvoice();
    }
    //更新草稿到服务器（因为每个声音保存文件名和本地ID）
    ctrl.updatedraftvoice = function(){
      self.controldata[field] = "";
      for(var i in ctrl.list){
        self.controldata[field] += (self.controldata[field]&&",") + ctrl.list[i].url;
      }
      self.updatedraft(field);
    }

    //用户要求开始录音：
    ctrl.onbeginrecord = function(){
      options.onbeginrecord && options.onbeginrecord();
      wx.startRecord({
        success: function (res) {
          ctrl.recording=true;
          $scope.$apply(); //默认处理
        }
      });
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function (res) {
          //alert("录音超过1分钟");
          ctrl.recordEnd(res.localId);
        }
      });
    }

    //用户要求停止录音：
    ctrl.onstoprecord = function(){
      options.onstoprecord && options.onstoprecord();
      wx.stopRecord({
        success: function (res) {
          //alert("onStopRecord success");
          ctrl.recordEnd(res.localId);
        }
      });
    }

    //录音结束：
    ctrl.recordEnd = function(localId){
      options.onendrecord && options.onendrecord();
      ctrl.recording = false;
      $scope.$apply(); //默认处理
      //alert("recordEnd: localId=" + localId);
      wx.uploadVoice({
        localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          //声音要保存localId用于播放, 而图片只要文件名即可
          //上传声音到自己的服务器
          API.post(options.voiceAPI, {serverid: res.serverId}, {
            success: function(json){
              if( json.errcode == 0){
                //json.url声音文件名，用于发出提问、回答等时，通知服务器
                var new_voice ={localId: localId, url: json.url};
                var done = options.success && options.success(new_voice);
                if(done !== true){
                  ctrl.list.push(new_voice);
                  $scope.$apply();
                  ctrl.updatedraftvoice();
                }
              }
            }
          });
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
  }
}



function initqa_attr($scope, attr){
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

// ━━━━━━━━━━━━━━ 我的提问 ━━━━━━━━━━━━━━
CTRL("MyAskListCtrl", function($scope) {
  API.module = "user";
  var D = $scope.D = {
    hash_data: "MyAskListCtrl",
    pagesize:10,
    pagebuttons:5,
    sublist: [{en:"user-all",cn:"全部"},
              {en:"user-tosatisfy",cn:"待评价"}, 
              {en:"user-satisfyed",cn:"已评价"}],
    baseurl: "#/frame/qa",
    baseAPI: "/qa/getlist",
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
  var ens = ["user-all", "user-tosatisfy", "user-satisfyed"];
  API.post("/qa/getusertodocount", { en: ens}, { success: function(json){
    if(json.errcode == 0){
      $scope.D.sublist[0].n = json.todocounts[ens[0]];
      $scope.D.sublist[1].n = json.todocounts[ens[1]];
      $scope.D.sublist[2].n = json.todocounts[ens[2]];
      $scope.$apply();
    }
  }});
});


//  问题列表 
CTRL("QuestionListCtrl", function ($scope) {
  API.module = "service";
  var D = $scope.D = {
    hash_data: "QuestionListCtrl",
    pagesize: 8, 
    sublist: [{en:"all",cn:"全部"}, 
              {en:"new",cn:"新提问"}, 
              {en:"toanswer",cn:"未回答"}, 
              {en:"tosatisfy",cn:"已回答"}, 
              {en:"tofile",cn:"已评价"}, 
              {en:"filed",cn:"已归档"}],
    baseurl: "#/frame/qa",
    baseAPI: "/qa/getlist",
    defaultlist: 1,
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


CTRL("MyAnswerListCtrl", function ($scope) {
  API.module = "expert";
  var D = $scope.D = {
    hash_data: "MyAnswerListCtrl",
    pagesize:10, 
    sublist: [ {en:"expert-answered", cn:"已回答"}],
    baseAPI: "/qa/getlist",
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
CTRL("QuestionToAnswerListCtrl", function ($scope) {
  API.module = "expert";
  $scope.mainpage = toNumber( GetQueryString("mainpage") );//从主页进来的？
  
  $scope.D = {
    hash_data: "QuestionToAnswerListCtrl",
    pagesize: 10, 
    sublist: [ 
        {en:"expert-toanswer", cn:"邀请回答"}],
    baseurl: "#/frame/toanswerlist",
    baseAPI: "/qa/getlist",
    onsuccess: function(json, post){
      if(post.en != "expert-toanswer")return;
      if($scope.mainpage == 1){
        if(json.rowcount == 0) window.location.href = "#/frame/myanswer";
        else if(json.rowcount == 1) window.location.href = "#/frame/"+API.module+"-qa-show?qaid="+json.list[0].id;
      }
    },
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
})


myapp.directive('qaContent', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("page/qa/qa-content.html"),
    scope: {
      users: "=",
      item: "=",
      canmodify: "@",
      onmodify: "&",
      lou: "@"
    },
    link: function (scope, element, attrs) {
      scope.me = API.userinfo;
      scope.API = API;
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
          case "编导退回":
            API.alert(
              m.ac + "(" + m.id + (scope.users && scope.users[m.id] && (", "+scope.users[m.id].name) || "") + "):" +
              "<br>"+ m.rq.substr(0,16) +
              "<br>【退回说明】：<br>"+ m.content
            ); 
            return;
        }
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
        API.confirm("您确定要修改？", function(){
          var url = API.module == "service" && "/qa/servicemodify" || "/qa/usermodify";
          API.post(url, {qaid: scope.item.id, data: EDIT.getCIA()}, {
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
        API.confirm("您确定要删除？", function(){
          var url = API.module == "service" && "/qa/servicedelete" || "/qa/userdelete";
          API.post(url, {qaid: item.id}, {
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
        API.confirm("您确定要恢复？", function(){
          var url = API.module == "service" && "/qa/serviceundelete" || "/qa/userundelete";
          API.post(url, {qaid: item.id}, {
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

