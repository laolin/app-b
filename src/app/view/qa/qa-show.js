/*  我要提问  */

!(function (window, angular, undefined) {

  var theModule = angular.module("dj-view");
  var theTemplate = `
<div class="overflow-auto bk-fff">
  <div ng-if="ASK">
    <!--  分类、难度和时效  -->
    <div class="color-ccc hh5 padding10 bk-f8f8f8 border-bottom border-b86" ng-if="1 || YN.hasasked">
      <span class="color-b86 b900">出价:{{module=='expert' && (ASK.attr.easy*0.8) || ASK.attr.easy}}元 / 时效:{{ASK.attr.timelimit}}天
        <span class="color-080 border1">{{ASK.attr.major||''}}</span>
      </span>
      <i class="pull-right color-555 b900">
        {{ (ASK.rq=='1999-99'&&'退回稿') || (ASK.type=='快速抢答' && '快速抢答' ) || (ASK.satisfy=='不满意' && '不满意') || (ASK.satisfy=='放弃回答'&&'放弃回答')
        || ('0'>=ASK.answerid&&'新提问') || ( (ASK.rq > ASK.answerrq && '未回答') || ( (ASK.rq > ASK.satisfyrq && '未评价') || ASK.satisfy)
        ) }}
      </i>
    </div>

    <!-- 提问情况，总是显示 -->
    <div class="overflow-auto padding5 border-bottom qa-show-item-box bk-row1" ng-if="1 || YN.hasasked">
      <div class="info" ng-if="module!='user'">
        <img ng-src="{{USERS[ASK.userid].headimgurl}}" ng-click="previewself(USERS[ASK.userid].headimgurl)">
        <div class="name">{{USERS[ASK.userid].name}}</div>
      </div>
      <div class="data color-555 b900 hh5">
        <qa-content class="overflow-auto padding5 qa-show-item-box bk-fff" users="USERS" item="ASK" lou="提问" canmodify="{{module=='service' || !ANSWER || ANSWER.length==0}}"
          onmodify="reget()" ng-click="answer(-1)">
        </qa-content>
      </div>
    </div>
    <div class="padding10 text-center bk-eee" ng-if="module=='user' && ASK.rq=='1999-99'">
      <div class="btn btn-primary" ng-click="reask()">重新提问</div>
    </div>

    <!-- 历史回答, 隐藏 / 显示 -->
    <div class="ww25 overflow-auto border-bottom hh6 text-primary" ng-show="count_un_satisfy" ng-click="show_history(!showinghistory)">
      <span class="hh5 margin10 float-right">
        <i class="fa fa-chevron-{{showinghistory&&'up'||'down'}}"></i> {{showinghistory&&'隐藏'||'显示'}}历史回答</span>
    </div>

    <!-- 当前的回答 -->
    <div class="ww25 overflow-auto border-bottom {{$index<count_un_satisfy&&'is-history'||''}} {{count_un_satisfy}}" i="{{$index}}"
      ng-repeat="asw in ANSWER">
      <div class="overflow-auto padding5 qa-show-item-box bk-row1" ng-show="asw.state!='评价不满意' && asw.state!='评价满意' && asw.state!='待评价'">
        <div class="info" ng-if="module!='user' && asw.userid">
          <img ng-src="{{USERS[(asw.userid=='110001'&&asw.senderid) || asw.userid].headimgurl}}" ng-click="previewself(USERS[(asw.userid=='110001'&&asw.senderid) || asw.userid].headimgurl)">
          <div class="name">{{USERS[(asw.userid=='110001'&&asw.senderid) || asw.userid].name}}</div>
        </div>
        <div class="ww25 color-555 b900 hh5 b300">
          <div class="hh6 img-row-em bk-ddd color-888" ng-show="module=='service'" ng-if="asw.userid!='110001' && asw.state!='评价不满意' && asw.state!='评价满意'">
            <img ng-src="{{USERS[asw.senderid].headimgurl}}" class="radius5" ng-click="previewself(USERS[asw.senderid].headimgurl)">
            <div class="text1">{{USERS[asw.senderid].name}}</div>
            <div class="text2">{{asw.rq_send|hhmm}}</div>
            <span class="r1 hh4">【指定回答】</span>
          </div>

          <qa-content class="overflow-auto padding5 qa-show-item-box bk-fff" ng-show="asw.rq && asw.state!='放弃回答'" item="asw" lou="{{asw.userid=='110001'&&module=='service'&&'匹配知识库'||'回答'}}"
            canmodify="{{module=='service' || ($index>=count_un_satisfy && API.userinfo.id==asw.userid&&asw.state=='问答')}}"
            onmodify="reget()">
          </qa-content>
          <div class="text-right color-888" ng-if="asw.state=='问答'"></div>
          <div class="text-right color-088" ng-if="asw.state=='用户满意'">
            <i class="fa fa-check"></i> 满意</div>
          <div class="text-right color-ccc" ng-if="asw.state=='用户不满意'">
            <i class="fa fa-close"></i> 不满意</div>
          <div class="ww25 overflow-auto padding15 color-555 b900 hh5" ng-if="!asw.rq && asw.state!='放弃回答' && module!='user'">
            未回答
          </div>
          <div class="ww25 overflow-auto padding15 color-555 b900 hh5" ng-if="asw.state=='放弃回答'">
            放弃回答：{{asw.attr.reason||''}}
            <div class="color-aaa hh6 b300 rq">{{asw.rq|hhmm}}</div>
          </div>
        </div>
      </div>
      <div class="hh6 img-row-em bk-eee fee" ng-if="module!='user' && (asw.state=='评价不满意' || asw.state=='评价满意')">
        <img ng-src="{{USERS[asw.userid].headimgurl}}" class="radius5" ng-click="previewself(USERS[asw.userid].headimgurl)">
        <div class="text1">{{USERS[asw.userid].name}}</div>
        <div class="text2">{{asw.rq|hhmm}}</div>
        <span class="hh4 margin10 float-right">{{asw.state=='评价不满意'&&'不'||''}}满意</span>
      </div>
      <div class="hh6 img-row-em bk-eee fee" ng-if="module=='user' && (asw.state=='评价不满意' || asw.state=='评价满意')">
        <span class="hh4 margin10 float-left">用户评价</span>
        <span class="hh4 margin10 float-right">{{asw.state=='评价不满意'&&'不'||''}}满意</span>
      </div>

      <!-- 我要评价 -->
      <div class="ww25 overflow-auto border-bottom padding15 text-center" ng-if="module=='user' && asw.state=='待评价'" ng-repeat="ac in [AC.getbody('我要评价')]">
        <span class="btn btn-primary" ng-click="ac.saysatisfy('满意')">满意</span>
        <span class="btn btn-primary" ng-click="ac.saysatisfy('不满意')">不满意</span>
      </div>
    </div>

    <!-- 未回答 / 未指定专家 -->
    <div class="ww25 overflow-auto border-bottom hh5 padding15 color-888" ng-show="!ANSWER || ANSWER.length==0 || ANSWER.length==count_un_satisfy">
      <span ng-if="module=='user'">未回答</span>
      <span ng-if="module=='service'">未指定专家</span>
    </div>

    <!-- 回答界面，用户和专家界面显示 -->
    <div class="answer-box overflow-auto padding5 border-bottom" ng-if="YN.experttoanswer" ng-repeat="ac in [AC.other['我要回答']]">
      <span class="hh4 color-f00">
        A:
      </span>
      <mulityinput rows="6" edit="EDIT"></mulityinput>
    
      <div>
        <surebutton css="btn-primary" d="ac.answer"></surebutton>
        <surebutton css="btn-primary" d="ac.notanswer" ng-if="!YN.is_sq"></surebutton>
        </div>
    </div>

    <!-- 归档 -->
    <div class="overflow-auto padding5 border-bottom {{ask.satisfy || 'color-ccc'}}" ng-if="YN.hasfiled && module=='service'">
      【已归档】
    </div>

    <!-- 多页面标签（知识库、标识、找专家、历史） -->
    <div class="list-group-item bk-f8f8f8 overflow-auto" ng-show="AC.body.length>1">
      <a class="padding10 {{tab.css||''}} {{(tab==AC.active&& 'color-fff bk-00f')|| 'color-88f'}}" ng-repeat="tab in AC.body" ng-click="AC.clicktab(tab)">{{tab.name}}</a>
    </div>

    <!-- 知识库 -->
    <div class="overflow-auto padding5" ng-if="AC.active.name=='知识库'" ng-repeat="ac in [AC.getbody('匹配知识库')]">
      <div class="box-list-item position-relative {{(ac.active==qa&&'active-userlist-item')||'bk-fff'}}" ng-click="ac.select(qa)"
        ng-repeat="qa in ac.D.list">
        <h4 class="full-width overflow-auto">
          <div class=" pull-right hh6 color-ccc">
            <span class="glyphicon glyphicon-time"></span> {{qa.includerq}}</div>
        </h4>
        <div class="hh5 color-888">{{(qa.type=='问答'&&qa.answer) || qa.ask}}</div>
        <surebutton css="abs-top-right btn btn-primary" d="ac.bt" ng-if="ac.active==qa"></surebutton>
      </div>
    </div>

    <!-- 退回提问 -->
    <div class="overflow-auto padding5" ng-if="AC.active.name=='退回提问'" ng-repeat="ac in [AC.getbody('退回提问')]">
      <span class="hh4 color-f00"> </span>
      <div class="answer-box overflow-auto margin-top15 padding15 bk-fff pos-follow">
        <mulityinput rows="6" edit="ac.BACK" placeholder="请输入提问将被退回的原因，以便用户修改。"></mulityinput>
      
        <div class="padding15 text-right">
          <div class="btn btn-primary" ng-click="ac.backtoask()">退回</div>
          </div>
      </div>
    </div>

    <!-- 标识 -->
    <div class="overflow-auto padding5" ng-if="AC.active.name=='标识'">
    </div>

    <!-- 找专家 -->
    <div class="overflow-auto padding5" ng-if="AC.active.name=='找专家'" ng-repeat="ac in [AC.getbody('找专家')]">
      <div class="list-group-item hh5 bk-eee overflow-auto">
        系统根据问题内容推荐专家：
      </div>
      <!--  搜索  -->
      <div class="padding5">
        <div class="input-group">
          <input type="text" class="form-control" ng-model="ac.pointexpert.D.searchtext" on-enter="ac.pointexpert.D.search()" placeholder="用户ID、姓名、呢称、手机号、专业等">
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button" ng-click="ac.pointexpert.D.search()">
              <aaa class="hidden-xs">本页</aaa>搜索</button>
          </span>
        </div>
      </div>
      <div class="list-group-item superior-list userlist-item {{ac.pointexpert.active == e && 'active-userlist-item'}}" ng-repeat="e in ac.pointexpert.D.list track by $index"
        ng-click="ac.pointexpert.select(e)">
        <img ng-src="{{e.headimgurl}}" ng-click="previewself(e.headimgurl)">
        <div class="name">{{e.attr.name || e.name}}{{ (e.nickname && ( ' ('+e.nickname+')')) || ''}}</div>
        <div class="id">
          <span class="">ID:{{e.id}}</span>
          <span ng-show="e.mobile">
            <span class="glyphicon glyphicon-phone-alt">{{e.mobile}}</span>
          </span>
          <span class="color-080" ng-if="e.attr.major1">　{{e.attr.major1||''}}</span>
          <span class="color-080" ng-if="e.attr.major2">　{{e.attr.major2||''}}</span>
          <span class="color-080" ng-if="e.attr.major3">　{{e.attr.major3||''}}</span>
        </div>
        <botton class="pop btn btn-primary" ng-click="ac.pointexpert.surepointexpert()" ng-if="ac.pointexpert.active == e">发送</botton>
      </div>
      <div class="text-center">
        <ul class="pagination pageturn-row">
          <li ng-repeat="n in page.pageturn track by $index">
            <a ng-click="gotopage(n)" class="{{n==page.pagenow && 'active-page-number'}}">{{(n==1&&'&laquo;1')||(n==page.pagecount&&(n+'&raquo;'))||n}}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 我要归档 -->
    <div class="history-answer overflow-auto padding5" ng-repeat="ac in [AC.getbody('我要归档')]" ng-if="AC.active.name=='我要归档'">
      <!-- 标签 -->
      <tagsinput tags="ac.tags"></tagsinput>
      &nbsp;　&nbsp;
      <surebutton css=" btn btn-primary" d="ac.yes"></surebutton>
      <div class="overflow-auto">
        <span class="keywords" ng-repeat="text in ac.keywords track by $index"> {{text}}
          <span class="glyphicon glyphicon-remove color-00f hh4" ng-click="ac.delkeyword($index)"></span>
        </span>
      </div>
    </div>
  </div>
</div>
`;


  theModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('frame.qa-show', {
        pageTitle: "问答详情",
        url: '/{module}-qa-show',
        template: theTemplate,
        controller: ['$scope', '$http', '$location', '$stateParams', ctrl]
      })
  }]);


  function ctrl($scope, $http, $location, $stateParams) {
    console.log("$stateParams = ", $stateParams);
    var module = $scope.module = API.module = $stateParams.module;
    var search = $location.search();
    var qaid = search.qaid;

    var actitle = [];
    var QA, ASK, ANSWER, GOOD, OLD, USERS, SQ, YN, MYANSWER;

    var AC = $scope.AC = {
      title: {},
      ac: {},
      body: [],
      getbody: function (s) {
        return AC.body[AC.title[s]];
      },
      clicktab: function (tab) {
        AC.active = tab;
        tab.show && tab.show();
      }
    };

    function reload(fn_success) {
      actitle = [];
      AC.title = {};
      AC.body = [];
      AC.active = {};
      SQ = $scope.SQ = {};
      YN = $scope.YN = {};
      return $http.post('用户/个人信息').then(json => {
        console.log("个人信息 json =", json);
        $http.post("old-api/qa/getdetail", { qaid: qaid, module }).then(json => {
          init_qadetail(json.qadetail);
          fn_success && fn_success(json);
        });
      }).catch(e => {
        console.log("个人信息 ERROR =", e);
      });
    }

    $http.post('WxJssdk/initWx').finally(reload);


    $scope.reget = function () {
      reload();
    }

    function init_qadetail(qadetail) {
      var neasy, ntimelimit;
      if (!qadetail) return;
      actitle = [];
      AC.title = {};
      AC.body = [];
      AC.active = {};
      SQ = $scope.SQ = {};
      YN = $scope.YN = {};
      QA = qadetail;
      //显示提问部分：
      ASK = $scope.ASK = qadetail.jbxx;
      if (ASK.attr) {//旧版兼容
        initqa_attr($scope, ASK.attr);//数据初始化
        neasy = ASK.attr.easy && SETTINGS.qa_easy2n[ASK.attr.easy] || 0;
        neasy > 0 && (ASK.attr.easy = neasy);
        ntimelimit = ASK.attr.timelimit && SETTINGS.qa_timelimit2n[ASK.attr.timelimit] || 0;
        ntimelimit > 0 && (ASK.attr.timelimit = ntimelimit);
      }
      ASK.imageslist = ASK.attr.images ? ASK.attr.images.split(",") : [];
      ASK.audioslist = ASK.attr.audioslist;
      if (API.iswx && ASK.audioslist) for (var i in ASK.audioslist) {
        audio_serverId_to_localId({ scope: $scope, audio: ASK.audioslist[i] });
      }
      //所有回答：
      ANSWER = $scope.ANSWER = qadetail.answers || [];//快速抢答时是我的回答，问答时是当前回答
      if (ANSWER.length > 0) for (var i in ANSWER) {
        ANSWER[i].attr && initqa_attr($scope, ANSWER[i].attr);//当前回答，数据初始化
      }

      //显示头像呢称等：
      USERS = $scope.USERS = qadetail.users;

      //计算历史回答占用问答的行数：
      function count_un_satisfy() {
        $scope.count_un_satisfy = 0;
        for (var i in ANSWER) {
          if (ANSWER[i].state == "评价不满意") $scope.count_un_satisfy = toNumber(i) + 1;
        }
      }
      //处理回答：
      function process_answers() {
        count_un_satisfy();
        $scope.showinghistory = false;
        YN.satisfyed = false;//用户已满意？
        for (var i in ANSWER) {
          if (ANSWER[i].state == "用户满意") YN.satisfyed = true; //定时之后才有效，所以不能是“评价满意”
        }
        //预先获取所有的回答的高度
        window.setTimeout(function () {
          $(".is-history").each(function (i) {
            ANSWER[i].css_height = $(this).height();
          });
          $scope.show_history(false)
        }, 10);
        //显示或隐藏历史操作：
        $scope.show_history = function (b) {
          $scope.showinghistory = b;
          window.setTimeout(function () {
            $(".is-history").each(function (i) {
              $(this).animate({ height: b && ANSWER[i].css_height || 0, "border-width": b && 1 || 0 }, 500);
            });
          }, 10);
        }
      }

      //可用操作部分：
      if (ASK.rq_delete < "2015-01" && ASK.rq > '2015-00') switch (module) {
        case "service":
          process_answers();
          YN.hasfiled = ASK.state > "2015-01";//是否已归档
          (!ANSWER || ANSWER.length == 0) && (actitle.push("退回提问"));
          (!ANSWER || ANSWER.length == 0 || "评价满意 待评价".indexOf(ANSWER[ANSWER.length - 1].state) < 0) && ASK.rq_delete < "2015-01" && (actitle.push("匹配知识库", "找专家"));
          YN.satisfyed && !YN.hasfiled && (actitle = ["我要归档"]);//在评价且定时结束后，才可归档
          break;
        case "expert":
          process_answers();
          YN.experttoanswer = false;
          for (var i in ANSWER) {
            if (ANSWER[i].userid == API.userinfo.id && (ANSWER[i].state == "待回答" || ANSWER[i].state == "") && ANSWER[i].rq < "2015-00") {
              YN.experttoanswer = true;
              QA.answering = ANSWER[i];
              break;
            }
          }
          YN.experttoanswer && (AC.other = { "我要回答": new allAction["我要回答"]("我要回答") });
          break;
        case "user":
          process_answers();
          (!ANSWER || ANSWER.length == 0) && (AC.other = { "修改提问": new allAction["修改提问"]("修改提问") });
          ANSWER && ANSWER.length > 1 && ANSWER[ANSWER.length - 1].state == '待评价' && (actitle.push("我要评价"));
          if (ASK.rq == '1999-99') {
            $scope.reask = function () {
              API.confirm("你确定要重新发出该提问吗？", function () {
                API.post("/qa/toask", { qaid: qaid }, {
                  success: function (json) {
                    if (json.errcode == 0) {
                      reload();
                    }
                    else {
                      if (json.field) {
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

      for (var i in actitle) {
        AC.title[actitle[i]] = i;
        AC.ac[actitle[i]] = new allAction[actitle[i]](actitle[i]);
        AC.body.push(AC.ac[actitle[i]]);
      }
      //只有一个，缺省显示出来：
      if (AC.body.length >= 1) {
        AC.clicktab(AC.body[0]);
      }
    }

    function CheckBacking(self) {
      window.setTimeout(function () {
        if (QA.backing) API.confirm("当前有退回提问操作，你要取消该退回提问操作吗？", function () {
          API.post("/qa/clearbacktoask", { qaid: qaid }, {
            success: function (json) {
              if (json.errcode == 0) {
                reload(function () {
                  QA.backing = false;
                  AC.clicktab(AC.ac[self.fullname || self.name]);
                });
              }
            }
          });
        }, function () {
          AC.active = AC.ac["退回提问"];
        });
      }, QA.backing && 10 || 2000);//尽管有2秒，也可能太短，导致弹不出这个提示。以后再说吧。
    }
    var allAction = {
      "匹配知识库": function () {
        var self = this;
        self.fullname = "匹配知识库";
        self.name = "知识库";
        self.show = function () {
          self.D = {
            pagesize: 6,
            post: { qaid: qaid },
            baseAPI: "/qa/getklmatchlist"
          }
          InitSmartPage($scope, self.D);
          CheckBacking(self);
        };
        self.select = function (kl) {
          self.active = kl;
        };
        self.bt = {
          value: "使用",
          fn_suretext: function () {
            return ["本操作将直接把当前知识库作为回答，", "并立即生效，通知提问者。", "确认要使用这个知识库？"]
          },
          sure: function () {
            API.post("/qa/answerfromkl", { klid: self.active.id, qaid: qaid }, {
              success: function (json) {
                if (json.errcode == 0) {
                  reload();
                }
              }
            });
          }
        }
      },
      "标识": function () {
        var self = this;
        self.name = "标识";
      },
      "退回提问": function () {
        var self = this;
        self.name = "退回提问";
        InitCIA($scope, "BACK");
        self.BACK = $scope.BACK;
        self.backtoask = function () {
          if (!self.BACK.controldata || self.BACK.controldata.content.length < 3) {
            API.alert("退回说明至少3个字符");
            return false;
          }
          API.confirm("您确定要退回？", function () {
            API.post("/qa/diredtbacktoask", { qaid: qaid, data: self.BACK.controldata }, {
              success: function (json) {
                $scope.reget();
              }
            });
          });
        }
      },
      "修改提问": function () {
        var self = this;
        self.name = "修改提问";
        //var attr = QA.reask && QA.reask.attr && initqa_attr($scope, QA.reask.attr) || {};
        InitCIA($scope, "REASK", { keyid: "qaid", url: "/qa/updatedraft" });
        var REASK = $scope.REASK;
        REASK.controldata = {
          id: ASK.id,
          qaid: ASK.id,
          content: ASK.content || ""
        }
        REASK.images.list = ASK.attr.imageslist || [];//图像列表初始化
        REASK.audios.list = ASK.attr.audioslist || [];//录音列表初始化
        self.reask = function () {
          if (REASK.controldata.content.length < 3) {
            tiperror("content", "提问正文至少3个字符");
            return false;
          }
          API.confirm("你确定要发出该提问吗？", function () {
            API.post("/qa/toask", { qaid: qaid }, {
              success: function (json) {
                if (json.errcode == 0) {
                  reload();
                }
                else {
                  if (json.field) {
                    tiperror(json.field, json.errmsg, 9000);
                  }
                }
              }
            });
          });
        }
      },
      "找专家": function () {
        var self = this;
        self.name = "找专家";
        self.show = function () {
          self.pointexpert.D = {
            pagesize: 6,
            baseAPI: "/qa/recommendexpert",
            post: { qaid: qaid, page: 0 },
            searchtext: "",
            search: function () {
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
          surepointexpert: function () {
            if (!self.pointexpert.expertidpointed) return;
            API.confirm("确定要指定该专家回答？", function () {
              API.post("/qa/pointanswer", { answerid: self.pointexpert.expertidpointed, qaid: qaid }, {
                success: function (json) {
                  if (json.errcode == 0) {
                    reload();
                  }
                  else {
                    API.alert(json.errmsg);
                    $scope.$apply();
                  }
                }
              });
            });
          },
          select: function (e) {
            self.pointexpert.expertidpointed = e.id;
            self.pointexpert.active = e;
          }
        }
      },
      "我要回答": function () {
        var self = this;
        self.name = "我要回答";
        InitCIA($scope, "EDIT", { keyid: "qaid", url: "/qa/updateanswerdraft" });
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
          value: "提交回答",
          fn_suretext: function () {
            return ["确认要提交？"]
          },
          fn_canshow: function () {
            if (EDIT.controldata.content.length < 3) {
              API.alert("提问正文至少3个字符");
              return false;
            }
            return true;
          },
          sure: function () {
            API.post("/qa/toanswer", { qaid: QA.answering.id }, {
              success: function (json) {
                if (json.errcode == 0) {
                  reload();
                }
                else {
                  if (json.field) {
                    tiperror(json.field, json.errmsg, 9000);
                  }
                }
              }
            });
            return false;
          }
        }
        self.notanswer = {
          value: "放弃回答",
          fn_suretext: function () {
            return ["确认要放弃回答？"]
          },
          btns: [
            {
              text: "非我专业", css: "bk-f00 color-fff",
              click: function () { nottoanswer("非我专业"); }
            },
            {
              text: "积分太少", css: "bk-f00 color-fff",
              click: function () { nottoanswer("积分太少"); }
            },
            {
              text: "时效太短", css: "bk-f00 color-fff",
              click: function () { nottoanswer("时效太短"); }
            },
            {
              text: "时间冲突", css: "bk-f00 color-fff",
              click: function () { nottoanswer("时间冲突"); }
            },
            {
              text: "不便回答", css: "bk-f00 color-fff",
              click: function () { nottoanswer("不便回答"); }
            },
            { text: "取消" }
          ]
        }
        function nottoanswer(text) {
          API.post("/qa/nottoanswer", { qaid: QA.answering.id, text: text }, {
            success: function (json) {
              if (json.errcode == 0) {
                window.location.href = "#/frame/toanswerlist";
                return;
              }
            }
          });
        }
      },

      "我要评价": function () {
        var self = this;
        self.name = "我要评价";
        self.saysatisfy = function (howsatisfy) {
          API.confirm("您确认对回答" + howsatisfy + "？", function () {
            API.post("/qa/saysatisfy", { howsatisfy: howsatisfy, qaid: ANSWER[ANSWER.length - 1].id }, {
              success: function (json) {
                if (json.errcode == 0) reload();
                else {
                  API.alert(json.errmsg);
                  $scope.$apply();
                }
              }
            });
          });
        }
      },
      "我要归档": function () {
        var self = this;
        self.name = "我要归档";
        self.tags = {
          tags: QA.fileinfo && QA.fileinfo.keywords && QA.fileinfo.keywords.join("\t") || "",
          ondelete: function (index, text) {
            API.post("/qa/delkeyword", { qaid: qaid, text: text }, {
              success: function (json) {
              }
            });
          },
          onappend: function (text) {
            API.post("/qa/addkeyword", { qaid: qaid, text: text }, {
              success: function (json) {
              }
            });
          }
        }
        self.yes = {
          value: "归档",
          fn_suretext: function () {
            return ["您确认完成其它操作，并将问题归档？"]
          },
          sure: function () {
            API.post("/qa/fileqa", { qaid: qaid }, {
              success: function (json) {
                if (json.errcode == 0) reload();
              }
            });
          }
        };
      }
    }


  }
})(window, angular);
