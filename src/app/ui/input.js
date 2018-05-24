console.log("input.js");
/**************************************************************************************************
 * 页面标题
****************************************************************************************************/
myapp.directive('setpagetitle', function() {
  return {
    restrict: 'AE',
    template: "",
    scope: {
      pre: "@",
      qgs: "@"
    },
    link: function (scope, element, attrs) {
      //消除对话框
      API.$scope && API.$scope.maindlg && (API.$scope.maindlg.showing = false);
      $.fixedBackground.clear();

      var $body = $('body');
      document.title = (scope.pre||"请高手-") + scope.qgs;
      // hack在微信等webview中无法修改document.title的情况
      var $iframe = $('<iframe src="/null.htm" style="display:none"></iframe>');
      $iframe.on('load',function() {
          setTimeout(function() {
              $iframe.off('load').remove();
          }, 0);
      }).appendTo($body);
    }
  };
});
myapp.directive('onEnter', function() {
  return {
    restrict: 'A',
    template: "",
    scope: {
      onEnter: "&"
    },
    link: function (scope, element, attrs) {
      $(element).keyup(function(event){
        if(event.which == 13) scope.onEnter();
      });
    }
  };
});

var setpagetitlerow_ppt_id = 1;
myapp.directive('setpagetitlerow', function() {
  setpagetitlerow_ppt_id ++;
  return {
    restrict: 'AE',
    //template: "<div id='xs-head-nav'></div><div id='xs-head-nav-div'></div>",
    template: '',
    scope: {
      module: "@",
      checklogin: "@",
      pre: "@",
      qgs: "@"
    },
    link: function (scope, element, attrs) {
      //消除对话框
      API.$scope && API.$scope.maindlg && (API.$scope.maindlg.showing = false);
      $.fixedBackground.clear();
      //同一个网址，根据前缀切换模块：
      window.location.hash.indexOf("/user-")>=0 && (API.module = "user");
      window.location.hash.indexOf("/service-")>=0 && (API.module = "service");
      window.location.hash.indexOf("/expert-")>=0 && (API.module = "expert");
      //强制指定模块：
      (scope.checklogin!="no") && API.setmodule(scope.module);
      //显示个人信息
      (scope.checklogin!="no") && 
      setTimeout(function() {
        (window.location.hash != "#/frame/myaccount") &&
        API.$scope.reget(function(){
          if(!API.hasmodule(API.module)){
            //alert("请更新您的个人信息");//（"+API.module+"模块尚未激活）
            //window.location.hash = "#/frame/myaccount";
            //API.alert("请更新您的个人信息");
          }
        });}, 20);
      //显示页面标题：
      var $body = $('body');
      document.title = (scope.pre||"请高手-") + scope.qgs;
      // hack在微信等webview中无法修改document.title的情况
      var $iframe = $('<iframe src="/null.htm" style="display:none"></iframe>');
      $iframe.on('load',function() {
          setTimeout(function() {
              $iframe.off('load').remove();
          }, 0);
      }).appendTo($body);
    }
  };
});
/**************************************************************************************************
 * 推广二维码
****************************************************************************************************/

myapp.directive('userqrcode', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/userqrcode.html"),
    scope: {
      text: "@",
      css: "@",
      userid: "@"
    },
    link: function (scope, element, attrs) {
      scope.API = API;
      scope.$watch('userid', function(newValue, oldValue) {
        var n = toNumber(scope.userid);
        n>0 && API.get("/wx/qrcodetextlong", {n: n}, {
          success: function(json){
            scope.qr_text = json.url;
            scope.$apply();
          }
        });
      });
      scope.$watch('text', function(newValue, oldValue) {
      });
    }
  };
});


/********************************************************************************
 * Bootstrap 下拉(基础)
*********************************************************************************/
var bootstrapDropdownTemplate =
       '  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">' +
       '    <span class="{{bootstrapDropdown.value&&colorGood||colorNone}}">{{bootstrapDropdown.value||defaultText||\'请选择\'}}</span>' +
       '    <span class="caret"></span>' +
       '  </button>' +
       '  <ul class="dropdown-menu {{cssDropdownMenu}}" role="menu" aria-labelledby="dropdownMenu1" ng-click="changeSelect($event)">' +
       '    <li role="presentation" class="padding5 {{((!item&&!bootstrapDropdown.value) ||item==bootstrapDropdown.value)&&cssSelected||\'\'}} {{!item&&colorNone}}"' +
       '      v="{{item}}"' +
       '      ng-repeat="item in bootstrapDropdown.list track by $index">{{item||\'[请选择]\'}}</li>' +
       '  </ul>';
var bootstrapDropdownLink = function (scope, element, attrs) {
  scope.defaultText = "请选择";
  scope.colorGood   = "auto";
  scope.colorNone   = "color-f00";
  scope.cssSelected = "bk-00f color-fff";
  scope.cssDropdownMenu = "dropdown-menu-single-line bk-f7f7f7";
  scope.$watch("bootstrapDropdown" , function(vNew){
    scope.defaultText = vNew.defaultText || "请选择";
    scope.colorGood   = vNew.colorGood   || "auto";
    scope.colorNone   = vNew.colorNone   || "color-f00";
    scope.cssSelected = vNew.cssSelected || "bk-00f color-fff";
  });
  scope.changeSelect = function(event){
    if(event.target.tagName == "LI"){
      var text = $(event.target).attr("v");
      if(scope.bootstrapDropdown.value != text){
        scope.bootstrapDropdown.value = text;
        scope.bootstrapDropdown.onchange && window.setTimeout(function(){scope.bootstrapDropdown.onchange(text);}, 10);
      }
    }
  };
}
/********************************************************************************
 * Bootstrap 下拉(控件)
*********************************************************************************/
myapp.directive('bootstrapDropdown', function() {
  return {
    restrict: 'A',
    template: bootstrapDropdownTemplate,
    scope: {
      bootstrapDropdown: "="
    },
    link: bootstrapDropdownLink
  };
});
/********************************************************************************
 * Bootstrap 专业下拉
*********************************************************************************/
myapp.directive('majorDropdown', function() {
  return {
    restrict: 'A',
    template: bootstrapDropdownTemplate,
    scope: {
      majorDropdown: "=",
      majorChange: "&",
      defaultText: "@",
      colorGood  : "@",
      colorNone  : "@",
      cssDropdownMenu  : "@",
      cssSelected: "@"
    },
    link: function (scope, element, attrs) {
      scope.$watch("bootstrapDropdown.value", function(vNew){
      });
      bootstrapDropdownLink(scope, element, attrs);
      scope.bootstrapDropdown = {
        list: ['', '混凝土结构','砌体结构','钢结构','组合结构、混合结构、复杂结构','桥梁工程','岩土、地下、隧道工程','土木工程施工与管理','环境科学与工程','其它'],
        value          : scope.majorDropdown  ,
        defaultText    : scope.defaultText    ,
        colorGood      : scope.colorGood      ,
        colorNone      : scope.colorNone      ,
        cssDropdownMenu: scope.cssDropdownMenu,
        cssSelected    : scope.cssSelected    ,
        onchange: function(value){
          if(value != scope.majorDropdown){
            scope.majorDropdown = value;
            API.$scope.safeApply();
            scope.majorChange && scope.majorChange();
          }
        }
      }
      scope.$watch("majorDropdown", function(vNew){
        scope.bootstrapDropdown.value = vNew;
      });
    }
  };
});

/**************************************************************************************************
 * 用户选择控件

//控件HTML：
  <inputusers data="inputusers"></inputusers>

//响应设置
  $scope.inputusers = {
    users: []
  }

获取用户列表：
  $scope.inputusers.users

****************************************************************************************************/
myapp.directive('inputusers', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/inputusers.html"),
    scope: {
      data: "="
    },
    link: function (scope, element, attrs) {
      var data = scope.data;
      !data.users && (data.users = []);
      var defaults_action = data.defaults_action = {
        en: data.searchen || "gz",
        baseAPI: data.baseAPI || ("/user/getlist"),
        clickuser: function(user){
          for(var i in data.users)if(data.users[i].id == user.id){
            data.users.splice(i, 1);
            return;
          }
          data.users.push(user);
        },
        deleteuser: function(user){
          for(var i in data.users)if(data.users[i].id == user.id){
            data.users.splice(i, 1);
            return;
          }
        }
      }
      var post = data.post || {};
      post.page = 0;
      var D = scope.D = {
        pagesize: 5,
        sublist: [ {en:defaults_action.en , cn:""}],
        baseAPI: defaults_action.baseAPI,
        post: post,
        searchtext:"",
        search: function(){
          D.post.searchtext = D.searchtext;
          D.post.page = 0;
          D.gotopage(D.post.page);
        }
      }
      InitSmartPage(scope, scope.D);

      scope.active = false;
      scope.deleteuser = function(user){
        (data.deleteuser || defaults_action.deleteuser)(user);
      };
      scope.clickuser = function(user){
        scope.active = user;
        (data.clickuser || defaults_action.clickuser)(user);
        data.change && data.change(user);
      };
    }
  };
});


/**************************************************************************************************
 * 通用对话框

//控件HTML：
  <pagedialog id="mainpagedialog" dlg="maindlg"></pagedialog>

//响应设置
  $scope.maindlg = API.dlg ={
    showing: false,
    show: function(options){
      options.onshow && options.onshow($("#mainpagedialog .prompt"));
      $scope.maindlg.showing = true;
    }
  };
 
显示调用： 
  API.dlg.show({
    onshow: function(div){
      div.html("AAA<br>bbb");
    }
  });
****************************************************************************************************/

myapp.directive('pagedialog', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/pagedialog.html"),
    scope: {
      dlg: "="
    },
    link: function (scope, element, attrs) {
      !scope.dlg && (scope.dlg={});
      var dlg = scope.dlg;
      dlg.settext = function(s){
        $(".prompt", $(element)).html(s);
      }
      scope.OK = function(){
        var unshow = !dlg.OK|| (dlg.OK(scope)!==false);
        if(unshow){
          dlg.showing = false;
        }
      }
      scope.CANCEL = function(){
        var unshow = !(dlg.CANCEL&& typeof dlg.CANCEL=='function')|| (dlg.CANCEL(scope)!==false);
        if(unshow){
          dlg.showing = false;
        }
      }
    }
  };
});


/**************************************************************************************************
 * 确认按钮
****************************************************************************************************/

myapp.directive('surebutton', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/surebutton.html"),
    scope: {
      css: "@",
      d: "="
    },
    link: function (scope, element, attrs) {
      scope.API = API;
      scope.onclick = function(){
        var maindlg = API.$scope.maindlg;
        if(scope.d.fn_canshow && !scope.d.fn_canshow(scope, maindlg))return;
        if(scope.d.fn_suretext){
          var str = scope.d.fn_suretext().join("<br>");
          $("#mainpagedialog .prompt").html(str);
        } 
        maindlg.showing = true;
        maindlg.tpl = false;
        maindlg.OKtext = "确定";
        maindlg.CANCELtext = "取消";
        maindlg.OK = function(){
          scope.d.sure && scope.d.sure();
        } 
        maindlg.CANCEL = 1;
        maindlg.btns = scope.d.btns;
        maindlg.userclick = function(btn){
          btn.click && btn.click();
          maindlg.showing = false;
        }
      }
    }
  };
});


/**************************************************************************************************
 * 下拉菜单
 * 
****************************************************************************************************/

myapp.directive('mydropdown', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/mydropdown.html"),
    scope: {
      value : "=" ,
      defaults: "@",
      id: "@",
      arr: "=",
      change : "&"
    },
    link: function (scope, element, attrs) {
      scope.dropdownselect = function(item){
        scope.value = (item);
        window.setTimeout(function(){scope.change();}, 100);
      }
    }
  };
});


/**************************************************************************************************
 * 文本、声音、图像 混合输入
****************************************************************************************************/

myapp.directive('mulityinput', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/mulityinput.html"),
    scope: {
      edit: "=" ,  
      placeholder: "@",  
      cols: "@", //预计每行几个图片
      rows: "@"  //textarea 的行数
    },
    link: function (scope, element, attrs) {
      scope.API = API;
      scope.cols2 = toNumber(scope.cols) || 4;
      scope.enablevoice = API.iswx;
      //小图片：
      scope.miniimg = function(url) {
        if(/^http(s)?\:\/\//.test(url)) return url;
        return url.substr(url.length -3, 3) == "jpg" && (url + ".96.jpg") || url;
      }
      //利用微信播放声音：
      scope.palyRecord = function(localId) {
        //alert( JSON.stringify(scope.edit.audios));
        wx.playVoice({localId: localId});
      }
      scope.previewself = function(pic) {
        (API.iswx && wx.previewImage || $.previewImage)({
          current: pic, // 当前显示图片的http链接
          urls: [pic] // 需要预览的图片http链接列表
        });
      }
      //相对路径的图片预览：
      scope.previewlocal = function(piclocal, arrlocal) {
        var pic = SITE.root + piclocal;//因为API数据库中保存相对路径
        var arr = [];
        for(var i in arrlocal)arr.push(SITE.root + arrlocal[i]);
        (API.iswx && wx.previewImage || $.previewImage)({
          current: pic, // 当前显示图片的http链接
          urls: arr // 需要预览的图片http链接列表
        });
      }
    }
  };
});
myapp.directive('mulityshow', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/mulityshow.html"),
    scope: {
      answ: "="
    },
    link: function (scope, element, attrs) {
      scope.enablevoice = API.iswx;
      //小图片：
      scope.miniimg = function(url) {
        if(/^http(s)?\:\/\//.test(url)) return url;
        return url.substr(url.length -3, 3) == "jpg" && (url + ".96.jpg") || url;
      }
      //利用微信播放声音：
      scope.palyRecord = function(localId) {
        //alert( JSON.stringify(scope.edit.audios));
        wx.playVoice({localId: localId});
      }
      scope.preview= function(index){
        API.$scope.previewlocal(scope.answ.imageslist[index], scope.answ.imageslist);
      }
    }
  };
});


myapp.directive('ciaContent', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/cia-content.html"),
    scope: {
      attr: "=",
      item: "=",
      title: "@",
      title2: "@",
      userid: "@",
      deletetext: "@",
      canmodify: "@",
      sub: "@",//递交操作时的附加post参数
      onmodify: "&",
      apimodule: "@"
    },
    link: function (scope, element, attrs) {
      scope.me = API.userinfo;
      scope.API = API;
      if(!API.userinfo)API.$scope.reget(function(){scope.me = API.userinfo;});
      //修改功能：
      scope.modifying = false;
      var init_edit = function (scope){
        if(!scope.attr)return;
        var EDIT = scope.EDIT = InitCIA(scope, "EDIT");
        EDIT.controldata = {
          content: scope.attr.content || ""
        }
        EDIT.images.list = scope.attr.imageslist || [];//图像列表初始化
        EDIT.audios.list = scope.attr.audioslist || [];//录音列表初始化
      }
      init_edit(scope);
      scope.tips = function (m){
        switch(m.ac){
          case "用户修改":
          case "编导修改":
            API.alert(
              m.ac + "(" + m.id+ (scope.users && (", "+scope.users[m.id].name) || "")+"):" +
              "<br>"+ m.rq.substr(0,16) +
              "<br>【原文】：<br>"+ m.olddata.content
            ); 
            return;
          case "编导退回":
            API.alert(
              m.ac + "(" + m.id + (scope.users && (", "+scope.users[m.id].name) || "") + "):" +
              "<br>"+ m.rq.substr(0,16) +
              "<br>【退回说明】：<br>"+ m.content
            ); 
            return;
        }
      }
      scope.$watch("attr", function(a, b){
        var c = scope.attr;
        scope.attr = a;
        if(a)init_edit(scope);
      });
      scope.gotomodify = function (attr){
        scope.attr = attr;
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
          var url = API.module == "service" && "servicemodify" || "usermodify";
          API.post(scope.apimodule + url, {ciaid: scope.item.id, sub: scope.sub||'', data: EDIT.getCIA()}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.modifying = false;
              scope.$apply();
              scope.onmodify();
            }
          });
        });
      }
      scope.gotodelete = function (attr){
        API.confirm("您确定要删除？", function(){
          var url = API.module == "service" && "servicedelete" || "userdelete";
          API.post(scope.apimodule + url, {ciaid: scope.item.id, sub: scope.sub||''}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.$apply();
              scope.onmodify();
            }
          });
        });
      }
      scope.gotoundelete = function (attr){
        API.confirm("您确定要恢复？", function(){
          var url = API.module == "service" && "serviceundelete" || "userundelete";
          API.post(scope.apimodule + url, {ciaid: scope.item.id, sub: scope.sub||''}, {
            success: function(json){
              if(json.errcode){
                API.alert(json.errmsg);
                scope.$apply();
                return;
              }
              scope.$apply();
              scope.onmodify();
            }
          });
        });
      }
    }
  };
});

/**************************************************************************************************
 * 多级列表
 * 
****************************************************************************************************/

myapp.directive('mulityselect', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/mulityselect.html"),
    scope: {
      value : "=" ,
      defaults: "@",
      options: "@",
      arr: "=",
      change : "&"
    },
    link: function (scope, element, attrs) {
      scope.tree = [];
      scope.list = [];
      scope.sel = [];
      scope.editing = false;
      
      //第n级，选择值v
      scope.onselect = function(n, v) {
        //保存数据
        scope.sel[n] = v;
        scope.sel.length = n + 1;
        //重新初始化下级
        inittree(n + 1, scope.tree[n][v]);
        //赋值：
        scope.value = scope.sel.join(",");
        //事件通知
        scope.change && window.setTimeout(function(){scope.change();}, 100); //有指定修改后如何处理
        
        if(n==0 && !scope.tree[0][scope.sel[0]]) scope.editing = false;
        if(n==1) scope.editing = false;
      }
      
      function inittree(n, treedata, not_clearvalue){
        //这级的树
        scope.tree[n] = treedata || scope.tree[n-1][scope.sel[n-1]];
        //这级的值置空
        !not_clearvalue && treedata && (scope.sel[n] = "");
        //生成这级列表框：
        scope.list[n] = [];
        for(var k in treedata)scope.list[n].push(k);
      }
      
      //设定多选框各级值, str_value：数组， 或用逗号连接的字符串
      scope.setvalue = function(str_value){
        scope.sel = (typeof str_value=='string' && ((str_value && str_value.split(",")) || [])) || str_value || [];
        for(var i in scope.sel){
          if(!scope.sel[i])break;
          i = toNumber(i);
          if(scope.tree[i])inittree(i+1, scope.tree[i][scope.sel[i]], true);
        }
      }
      scope.$watch('value', function(newValue, oldValue) {
        scope.setvalue(newValue)
      });  
      
      inittree(0, scope.arr);
      scope.setvalue( scope.value );
    }
  };
});

/************************************************************************************************
 * 标签输入框

//控件HTML：
  <tagsinput tags="tags"></tagsinput>
**************************************************************************************************/
var autoid = 1000;
myapp.directive('tagsinput', function() {
  return {
    restrict: 'AE',
    templateUrl: templateUrl("ui/tagsinput.html"),
    scope: {
      tags: "=",
      mustindick: "@",
      change : "&"
    },
    link: function (scope, element, attrs) {
      var tags = scope.tags;
      !tags && (tags = "");
      if(typeof tags == 'object') tags = tags.tags;
      scope.autoid = autoid++;
      var BQ = scope.BQ = {
        arr: tags && tags.split("\t") || [],
        text: "",
        clicknull: function(){
          //alert("aa");
          $("#ask-defit-input-" + scope.autoid)[0].focus();
        },
        textchange: function(){
          scope.debug =element[0].offsetTop
          var s = BQ.text.length;
          if (BQ.text.substring(s-1)==" " || BQ.text.substring(s-1)=="　" ){
            var sss=BQ.text.substring(0, s - 1);
            if(sss.length > 0){
              //标签不能等于已有标签，或被已有标签包含（允许新标签包含旧标签）：
              if(BQ.arr.join("\t").indexOf(sss)<0){
                BQ.arr.push(sss); 
                BQ.onchange();
                scope.tags && scope.tags.onappend && scope.tags.onappend(sss);
              }
            }
            BQ.text="";
          }
        },
        del: function(index){
          scope.tags && scope.tags.ondelete && scope.tags.ondelete(index, BQ.arr[index]);
          BQ.arr.splice(index, 1);
          BQ.onchange();
        },
        onchange: function(){
          if(typeof scope.tags == 'object')scope.tags.tags = BQ.arr.join("\t");
          else scope.tags = BQ.arr.join("\t");
          //因为上一行要等到事件的所有响应完成后才更新到绑定的变量上，所以要延时：
          window.setTimeout( scope.change, 10);
        }
      }
      scope.$watch('tags', function(newValue, oldValue) {
        tags = typeof newValue == 'object' ? newValue.tags : newValue;
        BQ.arr = tags && tags.split("\t") || [];
      });  
    }
  };
});



/**************************************************************************************************
 * 轮播
****************************************************************************************************/
var slide_id = 1001;
myapp.directive('sliders', function() {
  return {
    restrict: 'AE',
    template: '<div class="slides-box {{scope.css}}"></div>',
    scope: {
      d: "=",
      css: "@",
      goodsurl: "@",
      h: "="
    },
    link: function (scope, element, attrs) {
      slide_id ++;
      scope.id = "slides-" + slide_id;
      var goodsurl = scope.goodsurl || "#/frmae/goods?goodsid="
      !scope.d.arr && (scope.d.arr = []);
      
      function reshow(){
        $('.slides-box', element)
          .addClass(scope.css)
          .html("<div id='"+scope.id+"' class='slides-ppt'></div>");
        var h = toNumber(scope.h) || 190;
      
        //轮播初始化：
        $('#'+scope.id).html("");
        if(scope.d.arr && scope.d.arr.length > 1){
          for(var i in scope.d.arr){
            var html = data2html(scope.d.arr[i]);
            html && $('#'+scope.id).append(html);
          }
          $('#'+scope.id).slidesjs({
            width:360,
            height: h,
            play: {
              active: true,
              auto: true,
              interval: 4000,
              swap: true
            }
          });
        }
        else if(scope.d.arr && scope.d.arr.length == 1){
          var data = scope.d.arr[0];
          switch(typeof data){
            case "string": $('#'+scope.id).html('<img style="width:360px;height:' + h +'px" src="' + data +'">');break;
            case "object":
              if(data.goodsid && data.img) $('#'+scope.id).html(
                "<a href='"+goodsurl+data.goodsid+"'>"
                  +'<img style="width:360px;height:' + h +'px" src="' + data.img +'">'
                  +'<div class="bottom-bk opacity-50"></div>'
                  +'<div class="bottom-text">' + (data.text||'') +"</div>"
                +"</a>");
              else $('#'+scope.id).html(
                "<a "+(data.href && (" href='"+data.href+"'"))+">"
                  +'<img style="width:360px;height:' + h +'px" src="' + data.img +'">'
                  +"<div class='bottom-bk opacity-50'></div>"
                  +"<div class='bottom-text'>" + (data.text||'') +"</div>"
                +"</a>");
          }
        }
      }
      function data2html(data){
        switch(typeof data){
          case "string": return '<a><img src="' + data +'"></a>';
          case "object":
            if(data.goodsid && data.img) return "" +
              "<a href='"+goodsurl+data.goodsid+"'>"
                +"<img src='" + data.img +"'>"
                +"<div class='bottom-bk opacity-50'></div>"
                +"<div class='bottom-text'>" + (data.text||'') +"</div>"
              +"</a>";
            
            return "" +
              "<a "+(data.href && (" href='"+data.href+"'"))+">"
                +"<img src='" + data.img +"'>"
                +"<div class='bottom-bk opacity-50'></div>"
                +"<div class='bottom-text'>" + (data.text||'') +"</div>"
              +"</a>";
        }
        return false;
      }
      scope.d.reshow = reshow;
      //scope.$watch("d", function () { reshow(); });
      //scope.$watch("h", function () { reshow(); });
      setTimeout( reshow, 100);
    }
  };
});
/**************************************************************************************************
 * 文件上传
 * <simpleimage url="toppic" change="fn()" icontext="置顶图"></simpleimage>
****************************************************************************************************/
myapp.directive('simpleimage', function() {
  var directive = {
    restrict: 'AE',
    templateUrl: templateUrl("ui/simpleimage.html"),
    scope: {
      url: "=",
      icontext : "@",
      change : "&",
      btntext : "@" ,
      field : "@" ,
      previewcss : "@"
    },
    controller: function ($scope, $timeout, Upload) {
      $scope.$watch("localurl", function (file) {
        $scope.formUpload = false;
        if(file){
          file.upload = Upload.upload({
            url: SITE.API.root + '/fileupload/uploadpic',
            method: 'POST',
            headers: { 'my-header': 'my-header-value'},
            fields: ({field: $scope.field|| "pic", uid: API.userinfo.id}),
            file: file,
            fileFormDataName: 'myFile'
          });
          file.upload && file.upload.then(function (json) {
            $timeout(function () {
              if(!json.url)return;
              $scope.url = json.url;
              setTimeout(function(){$scope.change({$url: json.url});$scope.url = "";$scope.$apply();}, 10);
            });
          }, function (e) {
            console.log("上传文件错误", e);
          });
        }
      });
    }
  };
  directive.controller.$inject=["$scope", "$timeout", "Upload"];
  return directive;
});

/**************************************************************************************************
 * 多图片上传
 * <mulityimages urls="pptpics" change="fn()" prompt="点击上传图片"></mulityimages>
****************************************************************************************************/
myapp.directive('mulityimages', function() {
  var directive = {
    restrict: 'AE',
    templateUrl: templateUrl("ui/mulityimages.html"),
    scope: {
      urls: "=",
      prompt : "@",
      change : "&",
      previewlocal : "&",
      picext : "@" ,
      btntext : "@" ,
      field : "@" ,
      boxclass : "@",
      previewcss : "@"
    },
    controller: function ($scope, $http, $timeout, $compile, Upload, Util) {
      !$scope.urls && ($scope.urls = []); 
      $scope.$watch("url", function (file) {
        $scope.formUpload = false;
        if(file){

          //*
          //压缩图片
          Util.resizeFile(file).then(function(blob_data) {
            var fd = new FormData();
            fd.append("myFile", blob_data);
            fd.append("uid", API.userinfo.id);
            $http.post(SITE.API.root + '/fileupload/uploadpicsized', fd, {
              headers: {'Content-Type': undefined },
              transformRequest: angular.identity
            })
            .success(function(json) {
              if(!json.url)return;
              $scope.urls.push(json.url);
              $scope.change && $scope.change();
            })
            .error(function() {
              console.log("uploaded error...")
            });
          }, function(err_reason) {
            console.log(err_reason);
          });
          return;
          //*/
          
          file.upload = Upload.upload({
            url: SITE.API.root + '/fileupload/uploadpic',
            method: 'POST',
            headers: { 'my-header': 'my-header-value'},
            fields: sign_post({field: $scope.field|| "pic"}),
            file: file,
            fileFormDataName: 'myFile'
          });


          file.upload && file.upload.then(function (json) {
            $timeout(function () {
              if(!json.url)return;
              $scope.urls.push(json.url);
              $scope.change && $scope.change();
            });
          }, function (e) {
            console.log("上传文件错误", e);
          });
        }
      });
      
      $scope.preview= function(index){
        API.$scope.previewlocal($scope.urls[index], $scope.urls);
      }
      $scope.remove= function(index){
        $scope.urls.splice(index, 1);
        $scope.change();
      }
      $scope.forward= function(index){
        if(index >= $scope.urls.length)return;
        var item = $scope.urls[index];
        $scope.urls.splice(index, 1);
        $scope.urls.splice(index+1, 0, item);
        $scope.change();
      }
      $scope.backward= function(index){
        if(index <= 0)return;
        var item = $scope.urls[index];
        $scope.urls.splice(index, 1);
        $scope.urls.splice(index-1, 0, item);
        $scope.change();
      }
      
    }
  };
  directive.controller.$inject=["$scope", "$timeout", "Upload"];
  return directive;
});


// -------------------------------- 图片压缩: --------------------------------
myapp.service('Util', function($q) {
  var dataURItoBlob = function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
      type: mimeString
    });
  };

  var resizeFile = function(file) {
    var deferred = $q.defer();
    var img = document.createElement("img");
    try {
      var reader = new FileReader();
      reader.onload = function(e) {
        img.src = e.target.result;

        //resize the image using canvas
        var canvas = document.createElement("canvas");
        //var ctx = canvas.getContext("2d");
        //ctx.drawImage(img, 0, 0);
        var MAX_WIDTH = 1280;
        var width = img.width;
        var height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        //change the dataUrl to blob data for uploading to server
        var dataURL = canvas.toDataURL('image/jpeg');
        var blob = dataURItoBlob(dataURL);

        deferred.resolve(blob);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      deferred.resolve(e);
    }
    return deferred.promise;
  };
  return {
    resizeFile: resizeFile
  };
});
// -------------------------------- 图片压缩: ↑↑↑--------------------------------


myapp.directive('slideDelete', function() {
  return {
    restrict: 'AE',
    scope: {
      text: "@",
      ondelete: "&"
    },
    link: function (scope, element, attrs) {
      var w = $(element).outerWidth ();//应显示的宽度
      var h = $(element).outerHeight();//应显示的高度
      //按钮宽度
      var btn_w = 60;
      //设计按钮：
      scope.btn = $('<div style="position:absolute;z-index:5998;right:0;top:0;width:'+btn_w+'px;height:'+h+'px;color:#fff;background-color:#900;text-align:center;padding-top:'+(btn_w/2-15)+'px">'+(scope.text||'删除')+'</div>');
      //改造行,用一个绝对定位div将内容包裹起来
      $(element).contents().wrapAll('<div new_box style="position:absolute;z-index:5999;left:0;top:0;width:'+w+'px;height:'+h+'px;background-color:#fff;"></div>');
      //添加按钮：
      $(element).css({overflow:"hidden", position:"relative", "z-index":5999}).append(scope.btn);
      //滑屏功能
      var domListener = scope.domListener = $(element).children(":first-child");
      function sliding(event){
        var data = event.data;
        if(data.direction != "x"){
          event.fireMoving = false;//不是水平滑动的，请不要通知正在滑动
          return;
        } 
        if(scope.open)domListener.css({left: data.dx < 0 && -btn_w || data.dx<btn_w && data.dx-btn_w || 0});
        else domListener.css({left: data.dx<-btn_w && -btn_w || data.dx<0 && data.dx || 0});
      }
      function slideEnd(event){
        var data = event.data;
        scope.open = data.dx < -btn_w / 2;
        domListener.parent().css("z-index", scope.open && 6001 || 5999);
        //背景，点击收起
        var bk = $.fixedBackground(6000, scope.open);
        scope.open && bk.data("self", scope.domListener).click(function(){
          var self = bk.data("self");
          $.fixedBackground(6000, false);
          scope.open = false;
          self && self.animate({left: 0},100).parent().css("z-index", 5999);
        });
        scope.domListener.animate({left: scope.open ? -btn_w : 0},100);
      }
      domListener[0].addEventListener("slide-begin" , sliding);
      domListener[0].addEventListener("slide-moving" , sliding);
      domListener[0].addEventListener("slide-end" , slideEnd);
      //按钮事件
      scope.btn.click(function(){
        scope.ondelete && scope.ondelete();
        $.fixedBackground(6000, 1).click();
      });
    }
  };
});
(function($){
  $.fn.slideable = function(options){
    var self = this;
    self.options = $.extend({}, $.fn.slideable.defaults, options);
    self.min_dxy = 10;
    self.left = 0;
    self.downX = 0;
    self.downY = 0;
    self.pressed = false;
    self.draging = false;
    self.bindobj = options.bindobj || self;
    self.bindobj[0].addEventListener("mousedown" , function(event){ onmousedown(self, event); return false; })
    self.bindobj[0].addEventListener("mousemove" , function(event){ onmousemove(self, event); return false; })
    self.bindobj[0].addEventListener("mouseup"   , function(event){ onmouseup  (self, event); })
    self.bindobj[0].addEventListener('touchstart', function(event){ onmousedown(self, event); return false; })
    self.bindobj[0].addEventListener('touchmove' , function(event){ onmousemove(self, event); return false; })
    self.bindobj[0].addEventListener('touchend'  , function(event){ onmouseup  (self, event); })
    return this;
  }
  $.fn.slideable.defaults = {
    onclick: function(self, event){
      var dom = $(event.target);
      var href = dom.attr("href");
      while(1){
        if(href)break;
        dom = dom.parent();
        if(dom.length == 0) return;
        href = dom.attr("href");
      }
      window.location.href = href;
    }
  }
  function onmousedown(self, event){
    self.options.preventDefault && event.preventDefault();
    var cancelNext = self.options.onmousedown && self.options.onmousedown(self);
    if(cancelNext) return;
    self.downX = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageX : event.screenX;
    self.downY= event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageY : event.screenY;
    self.left = self.options.getLeft && self.options.getLeft(self) || 0;
    self.pressed = true;
    self.dragingX = false;
    self.dragingY = false;
  }
  function onmousemove(self, event){
    self.options.preventDefault && event.preventDefault();
    if(!self.pressed)return;
    var x = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageX : event.screenX;
    var y = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageY : event.screenY;
    if(!self.dragingX && !self.dragingY){
      var dx = x - self.downX ; dx<0 && (dx=-dx);
      var dy = y - self.downY; dy<0 && (dy=-dy);
      if(dx > dy*2 && dx >self.min_dxy)self.dragingX = true;
      if(dy > dx*2 && dy >self.min_dxy)self.dragingY = true;
    }
    self.dragingX && self.options.setLeft && self.options.setLeft(self, self.left + x - self.downX, event);
  }
  function onmouseup(self, event){
    if(!self.pressed)return;
    !self.dragingX && !self.dragingY && self.options.onclick && self.options.onclick(self, event);
    var x = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageX : event.screenX;
    var y = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageY : event.screenY;
    self.pressed = false;
    self.left0 = self.left;
    self.left += x - self.downX;
    self.dragingX && self.options.onslide && self.options.onslide(self, self.left, self.left0, event);
  }
  //背景功能
  $.fixedBackground = function(z_index, b_show){
    var bk = $($.fixedBackground.id = '#fixed-background-'+z_index+'');
    if(!b_show)return bk && bk.remove();
    if(!(bk && bk.length>0)){
      bk = $('<div id="fixed-background-'+z_index+'" style="position:fixed;z-index:'+z_index+';left:0;top:0;right:0;bottom:0;background-color:rgba(0,0,0,0)">');
      $("body").prepend(bk);
    }
    return bk;
  }
  //背景消除功能
  $.fixedBackground.id = false;
  $.fixedBackground.clear = function(){
    $.fixedBackground.id && $($.fixedBackground.id).remove();
  }

  
  $.previewImage = function(options){
    //var self = this;
    //self.options = options;
    !options.urls && (options.urls = [options.current]);
    //生成背景
    var bk = $.fixedBackground(6100, true);
    bk.css({"background-color":"rgba(0,0,0,1)"});
    bk.click(function(event){
      if(event.target == this){
        bk.remove();
      }
    });
    var w = bk.width();
    var h = bk.height();
    //手机端：
    
    var here = 0;
    var totle = options.urls.length || 1;
    //现在原位置：
    for(var i=0; i<totle; i++){
      if(options.urls[i] == options.current){
        here = i;
        break;
      }
    }
    var imgs = [];
    var slideable = {
      preventDefault: true,
      getLeft: function(self){return self.position().left;},
      setLeft: function(self, x){ self.css({left: x});},
      onclick: function(self, event){
          bk.remove();
        },
      onslide: function(self, x, x0){
        if(x - x0 < 10 && x0 - x < 10){
          bk.remove();
          return;
        }
        var min_dx = w/3; if(min_dx > 100) min_dx = 100;
        if(x - x0 < min_dx && x0 - x <min_dx){
          self.animate({left: self.left0},100);
          return;
        }
        if(x0 - x >= min_dx){
          //是向左滑，显示下一个
          var n = self.n + 1;
          if(n >= totle) n = 0;
          init_img(n, function(){
            //自己向左滑至不见
            self.animate({left: -w},100);
            //下一个从右向左滑：
            imgs[n].pic.css({left: w}).animate({left: imgs[n].left},100);
          });
          return;
        }
        else{
          //是向右滑，显示上一个
          var n = self.n - 1;
          if(n < 0) n = totle - 1;
          init_img(n, function(){
             //自己向右滑至不见
            self.animate({left: w},100);
            //下一个从左向右滑：
            imgs[n].pic.css({left: imgs[n].left - w}).animate({left: imgs[n].left},100);
         });
          return;
        }
      }
    };
    var img = new Image();
    function init_img(n, after_load){
      if(imgs[n]){
        after_load && after_load();
        return;
      }
      imgs[n] = {};
      imgs[n].pic = $('<img src="'+ options.urls[n] +'" style="position:absolute;left:' + w + 'px;top:0;">');
      imgs[n].pic.n = n;
      bk.append(imgs[n].pic);
      
      img.src = options.urls[n];
      img.onload = function(){
        var w100 = img.width * h / w >= img.height;
        if(w100){
          imgs[n].left = imgs[n].pic.left0= 0;
          imgs[n].pic.css({width: w, top: (h - img.height*w/img.width)/2 });
        }
        else{
          imgs[n].left = imgs[n].pic.left0 = (w - img.width*h/img.height)/2;
          imgs[n].pic.css({height: h});
        }
        after_load && after_load();
      }
      //滑屏功能
      imgs[n].pic.slideable(slideable);
    }
    init_img(here, function(){
      imgs[here].pic.css({left: imgs[here].left});
      bk.html(imgs[here].pic);
    });

    return this;
  }
  


})(jQuery);



