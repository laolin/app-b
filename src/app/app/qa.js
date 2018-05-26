

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
  
    //删除
    ctrl.delimage = function(index, localId) {
      ctrl.list.splice(index, 1);
      self.controldata.images = ctrl.list.join(",");
      self.updatedraft(field);
    }
    //用户要求获取图片：
    ctrl.uploading = "";
    ctrl.ongetimages = API.iswx && function(){
      wx.chooseImage({
        count: 8, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          //alert(JSON.stringify(localIds)); return;
          //$("#wx-debug").html("选择了图片共："+localIds.length);
          
          var upload_index = 0;
          var upload_fn = function( i ){
            //$("#wx-debug").append("<br>准备上传图片：" + i );
            ctrl.uploadImage(localIds[i], function(serverId){
              //localIds[i] = localIds[i].replace(/\\/g, "");
              //$("#wx-debug").append("<br>上传图片成功 " + i + " : " + localIds[i]);
              ctrl.wx_image_uploaded(serverId)
              if(i + 1 < localIds.length) upload_fn(i + 1);
            });
          };
          
          //从第0张图片开始上传
          upload_fn( 0 );
        }
      });
    } ||
    function(url){
      ctrl.list.push(url);//不可加绝对路径，因为API数据库中保存相对路径
      self.controldata.images = ctrl.list.join(",");
      self.updatedraft("images");
      $scope.$apply();
    }
    //上传图片到服务器（多张图片顺序执行）：
    ctrl.uploadImage = function(localId, fn){
      //$("#wx-debug").append("<br>开始上传：" + localId);
      wx.uploadImage({
        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          //$("#wx-debug").append("<br>上传图片成功：" );
          fn(res.serverId); // 返回图片的服务器端ID
        },
        fail: function(res) {
          //$("#wx-debug").append("<br>上传图  fail:"+JSON.stringify(res));
        }
      });
      ////$("#wx-debug").append("<br>怎么回事？" + localId);
    }
    ctrl.wx_image_uploaded = function(serverId){
      if(!options.url){
        API.get("/wx/uploadimage", {imageid: serverId}, {
          success: function(json){
            if( json.errcode == 0){
              ctrl.list.push(json.imageurl);//不可加绝对路径，因为API数据库中保存相对路径
              self.controldata.images = ctrl.list.join(",");
              $scope.$apply();
            }
            else alert(JSON.stringify(json));
          },
          error: function(e){
            alert("/wx/uploadimage error:\n" + JSON.stringify(e));
          }
        });
        return;
      }

      var post = {field: options.postfield, value: 0, imageid: serverId};
      post[keyid] = self.controldata.id; //这一行怎么合并到上一行？
      API.post(options.url, post, {
        success: function(json){
          if( json.errcode == 0){
            ctrl.list.push(json.imageurl);//不可加绝对路径，因为API数据库中保存相对路径
            $scope.$apply();
          }
          else alert(JSON.stringify(json));
          //$("#wx-debug").append(JSON.stringify(json));
        },
        error: function(htt, err){
          alert(JSON.stringify(htt));
        }
      });
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


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃     显示问答：详情、找专家、回答、评价                                   ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

CTRL("QuestionCtrl", function ($scope) {
  var qaid = GetQueryString("qaid");

  var actitle = [];
  var QA, ASK, ANSWER, GOOD, OLD, USERS, SQ, YN, MYANSWER;

  var AC = $scope.AC = {
    title:{},
    ac:{},
    body:[],
    getbody: function(s){
      return AC.body[AC.title[s]];
    },
    clicktab: function(tab){
      AC.active = tab;
      tab.show && tab.show();
    }
  };

  function reload(fn_success){
    actitle = [];
    AC.title = {};
    AC.body = [];
    AC.active = {};
    SQ = $scope.SQ = {};
    YN = $scope.YN = {};
    API.$scope.reget(function(json){
      API.get("/qa/getdetail", { qaid: qaid}, {
        success: function(json) {
          init_qadetail(json.qadetail);
          fn_success && fn_success();
          $scope.$apply();
        }
      });
    });
  }
  API.iswx ? WXAPP.init(function(){reload();}) : reload();
  $scope.reget = function(){
    API.iswx ? WXAPP.init(function(){reload();}) : reload();
  }
  function init_qadetail(qadetail) {
    var neasy, ntimelimit;
    if(!qadetail)return;
    actitle = [];
    AC.title = {};
    AC.body = [];
    AC.active = {};
    SQ = $scope.SQ = {};
    YN = $scope.YN = {};
    QA = qadetail;
    //显示提问部分：
    ASK = $scope.ASK = qadetail.jbxx;
    if(ASK.attr){//旧版兼容
      initqa_attr($scope, ASK.attr);//数据初始化
      neasy = ASK.attr.easy && SETTINGS.qa_easy2n[ASK.attr.easy] || 0;
      neasy>0 && (ASK.attr.easy = neasy);
      ntimelimit = ASK.attr.timelimit && SETTINGS.qa_timelimit2n[ASK.attr.timelimit] || 0;
      ntimelimit>0 && (ASK.attr.timelimit = ntimelimit);
    }
    ASK.imageslist = ASK.attr.images ? ASK.attr.images.split(",") : [];
    ASK.audioslist = ASK.attr.audioslist;
    if(API.iswx && ASK.audioslist)for(var i in ASK.audioslist){
      audio_serverId_to_localId({scope: $scope, audio: ASK.audioslist[i]});
    }
    //所有回答：
    ANSWER = $scope.ANSWER = qadetail.answers || [];//快速抢答时是我的回答，问答时是当前回答
    if(ANSWER.length > 0)for(var i in ANSWER){
      ANSWER[i].attr && initqa_attr($scope, ANSWER[i].attr);//当前回答，数据初始化
    }
    
    //显示头像呢称等：
    USERS = $scope.USERS = qadetail.users;

    //计算历史回答占用问答的行数：
    function count_un_satisfy(){
      $scope.count_un_satisfy = 0;
      for(var i in ANSWER){
        if(ANSWER[i].state == "评价不满意")$scope.count_un_satisfy = toNumber(i) + 1;
      }
    }
    //处理回答：
    function process_answers(){
      count_un_satisfy();
      $scope.showinghistory = false;
      YN.satisfyed = false;//用户已满意？
      for(var i in ANSWER){
        if(ANSWER[i].state == "用户满意") YN.satisfyed = true; //定时之后才有效，所以不能是“评价满意”
      }
      //预先获取所有的回答的高度
      window.setTimeout(function(){
        $(".is-history").each(function(i){
          ANSWER[i].css_height = $(this).height();
        });
        $scope.show_history(false)
      }, 10);
      //显示或隐藏历史操作：
      $scope.show_history = function(b){
        $scope.showinghistory = b;
        window.setTimeout(function(){
          $(".is-history").each(function(i){
            $(this).animate({height: b&&ANSWER[i].css_height||0, "border-width": b&&1||0},500);
          });
        }, 10);
      }
    }

    //可用操作部分：
    if(ASK.rq_delete < "2015-01" && ASK.rq > '2015-00')switch(API.module){
      case "service":
        process_answers();
        YN.hasfiled = ASK.state > "2015-01";//是否已归档
        (!ANSWER || ANSWER.length == 0) && (actitle.push("退回提问"));
        (!ANSWER || ANSWER.length == 0 || "评价满意 待评价".indexOf(ANSWER[ANSWER.length - 1].state)<0) && ASK.rq_delete < "2015-01" && (actitle .push("匹配知识库","找专家"));
        YN.satisfyed && !YN.hasfiled && (actitle = ["我要归档"]);//在评价且定时结束后，才可归档
        break;
      case "expert":
        process_answers();
        YN.experttoanswer = false;
        for(var i in ANSWER){
          if(ANSWER[i].userid==API.userinfo.id && (ANSWER[i].state=="待回答" || ANSWER[i].state=="") && ANSWER[i].rq<"2015-00"){
            YN.experttoanswer = true;
            QA.answering = ANSWER[i];
            break;
          }
        }
        YN.experttoanswer && (AC.other = {"我要回答": new allAction["我要回答"]("我要回答")});
        break;
      case "user":
        process_answers();
        (!ANSWER || ANSWER.length == 0) && (AC.other = {"修改提问": new allAction["修改提问"]("修改提问")});
        ANSWER && ANSWER.length >1 && ANSWER[ANSWER.length - 1].state=='待评价' && (actitle.push("我要评价"));
        if(ASK.rq == '1999-99'){
          $scope.reask = function(){
            API.confirm("你确定要重新发出该提问吗？", function(){
              API.post("/qa/toask", {qaid: qaid}, {
                success: function(json){
                  if( json.errcode == 0){
                    reload();
                  }
                  else{
                    if(json.field){
                      tiperror(json.field, json.errmsg, 9000);
                    }
                  }
                }
              });
            });
          }
        }
        break;
    }

    for(var i in actitle){
      AC.title[actitle[i]] = i;
      AC.ac[actitle[i]] = new allAction[actitle[i]](actitle[i]);
      AC.body.push( AC.ac[actitle[i]] );
    }
    //只有一个，缺省显示出来：
    if(AC.body.length >= 1){
      AC.clicktab(AC.body[0]);
    }
  }
  
  function CheckBacking(self){
    window.setTimeout(function(){
      if(QA.backing)API.confirm("当前有退回提问操作，你要取消该退回提问操作吗？", function(){
        API.post("/qa/clearbacktoask", {qaid: qaid}, {
          success: function(json) {
            if(json.errcode == 0){
              reload(function(){
                QA.backing = false;
                AC.clicktab(AC.ac[self.fullname || self.name]);
              });
            }
          }
        });
      },function(){
        AC.active = AC.ac["退回提问"];
      });
    },QA.backing&&10||2000);//尽管有2秒，也可能太短，导致弹不出这个提示。以后再说吧。
  }
  var allAction = {
    "匹配知识库": function(){
      var self = this;
      self.fullname = "匹配知识库";
      self.name = "知识库";
      self.show = function(){
        self.D = {
          pagesize: 6,
          post: {qaid: qaid},
          baseAPI: "/qa/getklmatchlist"
        }
        InitSmartPage($scope, self.D);
        CheckBacking(self);
      };
      self.select = function(kl){
        self.active = kl;
      };
      self.bt = {
        value:"使用",
        fn_suretext: function(){
          return ["本操作将直接把当前知识库作为回答，", "并立即生效，通知提问者。", "确认要使用这个知识库？"]
        },
        sure: function(){
          API.post("/qa/answerfromkl", {klid: self.active.id, qaid: qaid}, {
            success: function(json) {
              if(json.errcode == 0){
                reload();
              }
            }
          });
        }
      }
    },
    "标识":function(){
      var self = this;
      self.name = "标识";
    },
    "退回提问":function(){
      var self = this;
      self.name = "退回提问";
      InitCIA($scope, "BACK");
      self.BACK = $scope.BACK;
      self.backtoask = function(){
        if(!self.BACK.controldata || self.BACK.controldata.content.length <3){
          API.alert("退回说明至少3个字符");
          return false;
        }
        API.confirm("您确定要退回？", function(){
          API.post("/qa/diredtbacktoask", {qaid: qaid, data: self.BACK.controldata}, {
            success: function(json){
              $scope.reget();
            }
          });
        });
      }
    },
    "修改提问":function(){
      var self = this;
      self.name = "修改提问";
      //var attr = QA.reask && QA.reask.attr && initqa_attr($scope, QA.reask.attr) || {};
      InitCIA($scope, "REASK", { keyid:"qaid", url: "/qa/updatedraft"});
      var REASK = $scope.REASK;
      REASK.controldata = {
        id: ASK.id,
        qaid: ASK.id,
        content: ASK.content || ""
      }
      REASK.images.list = ASK.attr.imageslist || [];//图像列表初始化
      REASK.audios.list = ASK.attr.audioslist || [];//录音列表初始化
      self.reask = function(){
        if(REASK.controldata.content.length <3){
          tiperror("content", "提问正文至少3个字符");
          return false;
        }
        API.confirm("你确定要发出该提问吗？", function(){
          API.post("/qa/toask", {qaid: qaid}, {
            success: function(json){
              if( json.errcode == 0){
                reload();
              }
              else{
                if(json.field){
                  tiperror(json.field, json.errmsg, 9000);
                }
              }
            }
          });
        });
      }
    },
    "找专家":function(){
      var self = this;
      self.name = "找专家";
      self.show = function(){
        self.pointexpert.D = {
          pagesize: 6,
          baseAPI: "/qa/recommendexpert",
          post:{qaid: qaid, page: 0},
          searchtext:"",
          search: function(){
            self.pointexpert.D.post.searchtext = self.pointexpert.D.searchtext;
            self.pointexpert.D.post.page = 0;
            self.pointexpert.D.gotopage(self.pointexpert.D.post.page);
          }
        }
        InitSmartPage($scope, self.pointexpert.D);
        CheckBacking(self);
      }
      self.pointexpert = {
        name: "找专家",
        expertidpointed: 0,
        surepointexpert: function(){
          if(!self.pointexpert.expertidpointed )return;
          API.confirm("确定要指定该专家回答？", function(){
            API.post("/qa/pointanswer", {answerid: self.pointexpert.expertidpointed, qaid: qaid}, {
              success: function(json) {
                if(json.errcode == 0){
                  reload();
                }
                else{
                  API.alert(json.errmsg);
                  $scope.$apply();
                }
              }
            });
          });
        },
        select: function(e){
          self.pointexpert.expertidpointed = e.id;
          self.pointexpert.active = e;
        }
      }
    },
    "我要回答":function(){
      var self = this;
      self.name = "我要回答";
      InitCIA($scope, "EDIT", { keyid:"qaid", url: "/qa/updateanswerdraft"});
      var EDIT = $scope.EDIT;
      var attr = QA.answering && QA.answering.attr || {};
      EDIT.controldata = {
        id: QA.answering.id,
        qaid: QA.answering.id,
        content: attr.content || ""
      }
      EDIT.images.list = attr.imageslist || [];;//图像列表初始化
      EDIT.audios.list = attr.audioslist || [];;//录音列表初始化
      self.answer = {
        value:"提交回答",
        fn_suretext: function(){
          return ["确认要提交？"]
        },
        fn_canshow: function(){
          if(EDIT.controldata.content.length <3){
            API.alert("提问正文至少3个字符");
            return false;
          }
          return true;
        },
        sure: function(){
          API.post("/qa/toanswer", {qaid: QA.answering.id}, {
            success: function(json){
              if( json.errcode == 0){
                reload();
              }
              else{
                if(json.field){
                  tiperror(json.field, json.errmsg, 9000);
                }
              }
            }
          });
          return false;
        }
      }
      self.notanswer = {
        value:"放弃回答",
        fn_suretext: function(){
          return ["确认要放弃回答？"]
        },
        btns:[
          { text:"非我专业", css:"bk-f00 color-fff",
            click:function(){nottoanswer("非我专业");}
          },
          { text:"积分太少", css:"bk-f00 color-fff",
            click:function(){nottoanswer("积分太少");}
          },
          { text:"时效太短", css:"bk-f00 color-fff",
            click:function(){nottoanswer("时效太短");}
          },
          { text:"时间冲突", css:"bk-f00 color-fff",
            click:function(){nottoanswer("时间冲突");}
          },
          { text:"不便回答", css:"bk-f00 color-fff",
            click:function(){nottoanswer("不便回答");}
          },
          { text:"取消"}
        ]
      }
      function nottoanswer(text){
        API.post("/qa/nottoanswer", {qaid: QA.answering.id, text: text}, {
          success: function(json){
            if( json.errcode == 0){
              window.location.href = "#/frame/toanswerlist";
              return;
            }
          }
        });
      }
    },

    "我要评价":function(){
      var self = this;
      self.name = "我要评价";
      self.saysatisfy = function(howsatisfy){
        API.confirm("您确认对回答"+howsatisfy+"？", function(){
          API.post("/qa/saysatisfy", {howsatisfy: howsatisfy, qaid: ANSWER[ANSWER.length - 1].id}, {
            success: function(json){
              if( json.errcode == 0)reload();
              else{
                API.alert(json.errmsg);
                $scope.$apply();
              }
            }
          });
        });
      }
    },
    "我要归档":function(){
      var self = this;
      self.name = "我要归档";
      self.tags = {
        tags: QA.fileinfo && QA.fileinfo.keywords && QA.fileinfo.keywords.join("\t") || "",
        ondelete: function(index, text){
          API.post("/qa/delkeyword", {qaid: qaid, text: text}, {
            success: function(json){
            }
          });
        },
        onappend: function(text){
          API.post("/qa/addkeyword", {qaid: qaid, text: text}, {
            success: function(json){
            }
          });
        }
      }
      self.yes = {
        value:"归档",
        fn_suretext: function(){
          return ["您确认完成其它操作，并将问题归档？"]
        },
        sure: function(){
          API.post("/qa/fileqa", {qaid:qaid}, {
            success: function(json){
              if( json.errcode == 0)reload();
            }
          });
        }
      };
    }
  }
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

