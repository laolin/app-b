// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          本地存贮                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
(function(){
  var classLocalValues = window.classLocalValues = function(keySettings){
    this._keySettings = keySettings || "obj";
    var str = window.localStorage.getItem(this._keySettings);
    this._value = str && JSON.parse(str);
  }
  classLocalValues.prototype = {
    saveValue: function(){
      this._changed = false;
      typeof this._value != "object" && (this._value = {});
      window.localStorage.setItem(this._keySettings, JSON.stringify(this._value));
    },
    getValue: function(key_arr){
      if(arguments.length == 0) return this._value;
      var p = this._value;
      for(var i=0; i<key_arr.length; i++){
        if(typeof p != "object")return "";
        if(!p[key_arr[i]])return "";
        p = p[key_arr[i]];
      }
      return p || "";
    },
    setValue: function(key_arr, v){
      if(arguments.length == 0){
        delete window.localStorage.getItem(this._keySettings);
        return;
      }
      if(arguments.length == 1){
        this._value = {}
        for(var k in key_arr)if(typeof key_arr[k] != 'function'){
          this._value[k] = key_arr[k];
        }
        this.saveValue();
        return;
      }
      
      var nsub = key_arr.length;
      if(nsub == 0){
        this._value = v;
        this.saveValue();
        return;
      }
      if(typeof this._value != "object")this._value = {};
      if(nsub == 1){
        this._value[key_arr[0]] = v;
        this.saveValue();
        return;
      }
      var p = this._value;
      for(var i=0; i < nsub - 1; i++){
        if(typeof p[key_arr[i]] != "object"){
          p[key_arr[i]] = {};
        }
        p = p[key_arr[i]];
      }
      p[key_arr[nsub - 1]] = v;
      this.saveValue();
    }
  }
  //localStorage.setItem("COOKIE_localStorage", "{}");
  var COOKIE_localStorage = window.COOKIE_localStorage = new classLocalValues("COOKIE_localStorage");
})();

var API={
  domain: (function(){
      var n = window.location.href.indexOf("://", 0) + 3;
      if(window.location.href.substr(n, 4) == "www.") n += 4;
      var s = window.location.href.substr(n, window.location.href.indexOf("/", 12) - n);
      return s;
    })(),
  APIroot: "../../../../api-qgs",
  SITE: SITE,  //所有配置信息
  root: SITE && SITE.API && SITE.API.root || "/API",  //一般浏览器不支持跨域请求
  QRcode: {root: "api/qrcode"},  //支付请求
  module: "",

  templateUrl:templateUrl,//版本控制

  setuserinfo: function(userinfo){
    API.userinfo = userinfo;
    var module = API.module;
    API.setmodule(module);
    if(module != API.module){
      window.location.href = "#/frame/myaccount?module=" + API.module;
    }
    API.isnotapplyed = userinfo[API.module+'state']=='0';//是不是还没申请激活？
    API.useractived = userinfo[API.module+'state']=='3';//是不是还没申请激活？
  },
  
  navmenu: {
    "user":[
      {"href": "nine-ask","text":"首页", "icon": "home" },
      {"href": "toask","text":"我要提问", "icon": "tower" },
      {"href": "myask","text":"我的提问", "icon": "question-sign" },
      //{"href": "bbs-list-user","text":"高谈阔论", "fa": "comments" },
      {"href": "myaccount", "text":"我的帐户", "icon": "user" }
    ],
    "expert":[
      {"href": "toanswerlist","text":"待回答", "icon": "tower" },
      {"href": "myanswer","text":"我的回答", "icon": "question-sign" },
      //{"href": "expert-kl-list","text":"知识库", "icon": "question-sign" },
      //{"href": "bbs-list-user","text":"高谈阔论", "fa": "comments" },
      {"href": "myaccount","text":"我的帐户", "icon": "user" }
    ],
    "service":[
      {"href": "userlist","text":"用户", "icon": "user" },
      {"href": "qa","text":"问答", "icon": "question-sign" },
      //{"href": "expert","text":"专家库", "icon": "tower" },
      {"href": "bbs-list-service","text":"论坛管理", "fa": "comments" },
      //{"href": "user","text":"编导", "icon": "glass" }
      {"href": "myaccount","text":"我的帐户", "icon": "user" }
    ]
  },
  //设置模块
  setmodule: function(en, en2){
    if( en != 'user' && en != 'expert' && en != 'service'
     && en2!= 'user' && en2!= 'expert' && en2!= 'service' )return;
    if(!API.hasactivemodule())API.module = "user";
    else if(API.hasmodule(en) && API.module == en)return;
    else if(API.hasmodule(en2) && API.module == en2)return;
    else if(API.hasmodule(en))API.module = en;
    else if(API.hasmodule(en2))API.module = en2;
    else if(API.hasmodule("service")) API.module = "service";
    else if(API.hasmodule("expert")) API.module = "expert";
    else API.module = "user";
  },
  
  //是否已有激活的模块
  hasactivemodule: function(en){
    if(!API.userinfo)return false;
    for(var module in {user:1, service:1, expert:1}){
      if(en && module==en && API.userinfo[module+'state']=='3')return true;
      if(!en && API.userinfo[module+'state']=='3')return true;
    }
    return false;
  },
  
  //是否还有其它模块
  hasmoremodule: function(){
    if(!API.userinfo)return false;
    for(var module in {user:1, service:1, expert:1}){
      if(module != API.module && API.userinfo[module+'state']=='3')return true;
    }
    return false;
  },
  
  //是否已激活指定模块
  hasmodule: function(module){
    if(!API.userinfo)return false;
    return  API.userinfo[module+'state']=='3';
  },

  hassomeright: function(rights){
    for(var i in rights)if(API.hasright(rights[i]))return true;
    return false;
  },

  hasallright: function(rights){
    for(var i in rights)if(!API.hasright(rights[i]))return false;
    return true;
  },

  hasright: function(right){
    if(!API.userinfo || !API.userinfo.d || !API.userinfo.d["权限"])return false;
    for(var i in API.userinfo.d["权限"]){
      if(API.userinfo.d["权限"][i] == "超级管理员")return true;
      if(API.userinfo.d["权限"][i] == right)return true;
    }
    return false;
  },

  sign_get: function(url, data){
    url =  API.root + url + (url.indexOf("?")>0 ? "&":"?");
    if(data){
      for(var k in data)url += k + "=" + data[k] + "&";
    }
    function sign_get() {
      var password = API.getCookie("user_password");
      var uid = API.getCookie("user_id");
      var t = (new Date().getTime()/1000).toFixed()
      return "uid="+uid +"&t="+t +"&sign="+ MD5(t + password) +"&module=" + API.module;
    }
    return url + sign_get();
  },

  sure_userinfo: function(fn_exit_userinfo){
    if(!API.userinfo || !API.userinfo.id || API.userinfo.changed){ //在此页刷新或用户直接进入此页
      var element  = angular.element($("#afterlogin"));
      var controller = element.controller();
      var scope = element.scope();
      scope.reget(fn_exit_userinfo);
    }else{
      fn_exit_userinfo(API);
    }
  },
  
  
  get: function(url, data, options){
    if(options){
      options.dataType = "json";
      options.url = API.sign_get(url, data);
      return API.ajax(options);
    }
    options = url;
    options.url = API.sign_get(options.url);
    options.dataType = "json";
    return API.ajax(options);
  },
  post: function(url, data, options){
    function sign_post(data) {
      var password = API.getCookie("user_password");
      var uid = API.getCookie("user_id");
      var t = (new Date().getTime()/1000).toFixed();
      data.module = API.module;
      data.uid = uid;
      data.t = t;
      data.sign = MD5(t + password);
      return data;
    }
    if(options){
      options.dataType = "json";
      options.type = "POST";
      options.url = API.root + url;
      options.data = sign_post(data);
      return API.ajax(options);
    }
    options = url;
    options.url = API.root + options.url;
    options.type = "POST";
    options.data = sign_post(options.data);
    options.dataType = "json";
    return API.ajax(options);
  },
  ajax: function(options){
    var old_success = options.success;
    options.success = function(json){
      switch(json.errcode) {
        case 101://没有权限
          window.location.href = "#/frame/myaccount";
          return;
        default:
          old_success && old_success(json);
          return;
      }
    }
    $.ajax(options);
  },

  typetree: SETTINGS.typetree,
  dick:{
    major: getmajor()
  },
  majors: { "结构设计":0,
            "混凝土结构":0,
            "砌体结构":0,
            "钢结构":0,
            "空间结构":0,
            "组合结构":0,
            "混合结构":0,
            "新型结构":0,
            "新材料结构":0,
            "桥梁工程":0,
            "地下工程":0,
            "隧道工程":0,
            "结构分析、计算":0,
            "结构实验":0,
            "结构健康监测":0,
            "既有结构性能评价与修复":0,
            "混凝土结构材料":0,
            "土木工程施工与管理":0,
            "地基与基础工程":0,
            "岩土工程减灾":0,
            "环境岩土工程":0,
            "结构抗震":0,
            "结构抗风":0,
            "结构振动控制":0,
            "结构抗火":0,
            "地下管网":0
  },
      
  pre_cookie:"qgs_root_",
  setCookie: function(k, v, min){
    if(window.localStorage){
      var cookies = COOKIE_localStorage.getValue() || {};
      typeof cookies!="object" && (cookies = {});
      cookies[k] = v;
      COOKIE_localStorage.setValue(cookies);
      setCookie(API.pre_cookie + k, "", 0);
    }else{
      setCookie(API.pre_cookie + k, v, min);
    }
  },
  getCookie: function(k){
    if(window.localStorage){
      var cookies = COOKIE_localStorage.getValue();
      (!cookies || typeof cookies!="object") && (cookies = {});
      if(false && !cookies[k]){
        cookies[k] = getCookie(API.pre_cookie + k);
        COOKIE_localStorage.setValue(cookies);
        setCookie(API.pre_cookie + k, "", 0);
      }
      return cookies[k];
    }else{
      return getCookie(API.pre_cookie + k);
    }
  },
  MD5: function(password){
    return MD5(password+"@qgs");
  },

  loginbywx: true, //是否允许微信登陆
  iswx: navigator.userAgent.indexOf("MicroMessenger") > 0
};


// angular.module('dj-http').run(['$http', '$q', function($http, $q){
//   API.ajax = function(options){
//     console.log("API.ajax 请求: ", options);
//     if(options.type == 'POST'){
//       return $http.post(options.url, options.data).then(json=>{
//         return options.success(json);
//       }).catch(e=>{
//         console.log("API.ajax 错误: ", e);
//       })
//     }
//     return $http.post(options.url, options.data).then(json=>{
//       return options.success(json);
//     }).catch(e=>{
//       console.log("API.ajax 错误: ", e);
//     })
//   }
// }])


var USER = {
  datas: {},
  set_data: function(datas){
    for(var k in datas){
      USER.datas[k] = datas[k];
      USER.datas[k].changed = false;
    }
  },
  logout: function(url){
    USER.datas = {};
    API.setCookie("user_id", 0);
    API.setCookie("user_password", "");
    url && (window.location.href = url);
  },
  hasright: function(right){
    if(USER.datas.me && USER.datas.me.superadmin == 'true')return true;
    return USER.hasnormalright(right);
  },
  hasnormalright: function(right){
    if(!G.V(USER.datas.me, "d", "权限"))return false;
    for(var i in USER.datas.me.d["权限"]){
      if(USER.datas.me.d["权限"][i] == right)return true;
    }
    return false;
  },

  get_data: function(options){
    //需要的数据
    !options.datas && (options.datas = []);
    var datas = [];
    for(var k in options.datas){
      var name = options.datas[k];
      if(!USER.datas[name] || USER.datas[name].changed)datas.push(options.datas[k]);
    }
    //如果原来已有数据：
    if(datas.length == 0){
      options.success && options.success(0);
      return;
    }
    //需要请求数据：
    var share_id = toNumber(getCookie("gs_share_id"));
    API.post("/user/getuserdatas", {datas: datas ,share_id: share_id}, {
      success:function(json){
        USER.set_data(json.datas);
        options.success && options.success(1);
      }
    });
  }
};

API.setCookie('gs_user_last_module', API.module);
function gotologin(){
  API.setCookie('return_url', window.location.href);
  API.setCookie('user_id', "");//为了交给主页处理，且不会造成循环，取消cookie（如果跨域跳转，可能造成循环）。
  //window.location.href = "/";//交给主页处理
  window.location.href = (API.iswx && "#/login?mode=wx&" || "#/login?") + 'pageTo=abc';
}
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃               常用函数                                                       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function _number(arg){
	var i,n,R=0;
	for(i = 0; i < arg.length; i++){
		n=arg[i];
		if(typeof(arg[i])!="number")n=parseFloat(arg[i]);
		if(isNaN(n))n= 0;
		R+=n;
	}
	return parseFloat(R.toFixed(8));
}
function toNumber(){return _number(arguments);}

function money() {
    var n = _number(arguments);
    return  n.toFixed(2);
}
function no_undefined(v){if(v==undefined)return '';if(v=='undefined')return '';return v;}

function var2json(v,nsub){//---- 转换为 PHP 代码 ---------
	if(typeof nsub=='undefined')nsub=5;
	switch(typeof(v)){
		case "number":return v;
		case "string":return '"'+v+'"';
		case "boolean":return v ? 1 : 0;
		case "object":
			if(nsub <= 0)return '["..."]';
			var s="";
			for(var k in v){
				if(s)s+=",";
				s+= var2json(k,nsub-1) + ":" + var2json(v[k],nsub-1);
			}
			return "{"+s+"}";
	}
	return '""';
}
function arr2json(v,nsub){//---- 转换为 PHP 代码 --------- 
	if(typeof nsub=='undefined')nsub=5;
	switch(typeof(v)){
		case "object":
			if(nsub <= 0)return "['...']";
			var s="";
			for(var k in v){
				if(s)s+=",";
				s+= var2json(v[k],nsub-1);
			}
			return "["+s+"]";
		default:return "[]";
	}
	return "''";
}



// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          字典                                       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function  getmajor(k1, k2){
  var arr = SETTINGS.typetree;
  if(k1){
    arr = arr[k1];
    if(k2){
      arr = arr[k2];
    }
  }
  var R = [];
  for(var k in arr) R.push(k);
  return R;
}
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          延时提示框 , 信赖 jQuery + Bootstrap        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function tooltipsdelay(self, str, ms, bottom){
  if(bottom)
    self.attr("data-placement","bottom");
  self.attr("title",str)
        .tooltip({html: true})
        .tooltip('show');
  window.setTimeout(function(){
        self.tooltip('destroy');
    }, ms);
}
function tiperror(field, errmsg, ms){
  var input = $("#question-" + field);//是输入框？
  if(input.length == 0)input = $("#dropdown-menu" + field);//下拉框
  var bottom_tip = " major1 major2 easy timelimit".indexOf(field)>0;
  tooltipsdelay(input, "<h4>"+errmsg+"</h4>", ms||2000, bottom_tip);
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          Query                                       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function GetQueryString(name){
   var reg = new RegExp("(\\?|&)"+ name +"=([^&]*)(&|$)");
   var r = window.location.href.substr(1).match(reg);
   if(r != null)return unescape(r[2]); 
   return null;
}


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          智能页号                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function InitSmartPage($scope, D){
  D.defaultlist = D.defaultlist || 0;
  D.sublist = D.sublist || [{en:"all",cn:"all"}];
  $scope.page = //当有多个翻页时，此变量不可用
  D.page = new SmartPage(D.pagesize, 1, D.pagebuttons||7);
  
  function seten(en){
    for(var k in D.sublist)if(D.sublist[k].en == en || D.sublist[k].cn == en){
      D.en = D.sublist[k].en;
      D.cn = D.sublist[k].cn;
      return ;
    }
    D.en = D.sublist[D.defaultlist].en;
    D.cn = D.sublist[D.defaultlist].cn;
  }
  function setpage(nthpage){
    var post = D.post || {};
    post.en = D.en;
    post.page = nthpage;
    post.pagesize = D.pagesize;
    //保存页面数据，下次转到此页时，初始化将使用此数据：
    if(D.hash_data){
      InitSmartPage.History[D.hash_data] = post;
    }
    API.post(D.baseAPI, post, {
      success: function(json){
        var todo = (!D.onsuccess && true) || D.onsuccess(json, post)!==false;
        if(!todo) return;
        D.list = json.list;
        json.data && (D.data = json.data);
        D.page.settotlerow(json.rowcount, nthpage);
        D.page.setpagenow(nthpage);
        $scope.$apply();
      }
    });
  }
  
  // -------- 用于页码事件：第几页 ------------
  var old_page = 1;
  var old_en = GetQueryString("en");
  $scope.gotopage = //当有多个翻页时，此变量不可用
  D.gotopage = function(nthpage){ 
    setpage(nthpage);
    if(nthpage == old_page && old_en && old_en == D.en)return;
    old_en = D.en;
    old_page = nthpage;
  }
  // -------- 用于分类事件：显示子列表 ------------
  $scope.setsublist = //当有多个翻页时，此变量不可用
  D.setsublist = function(en, nthpage){
    seten(en);
    D.gotopage(nthpage || 1);
  }
  //如果有保存页面数据，现在初始化，就要使用此数据：
  if(D.hash_data){
    var mem = InitSmartPage.History[D.hash_data];
    if(mem && mem.en){
      D.post = mem;
      D.en = mem.en;
      D.pagesize = mem.pagesize;
      D.searchtext = mem.searchtext || "";
      setpage(mem.page);
      return;
    }
  }
  //通用初始化
  D.setsublist( GetQueryString("en"), toNumber(GetQueryString("page")));
}
InitSmartPage.History = {};

function SmartPage(rowperpage, pagenow, maxshow){
  var _self = this;
  this.rowperpage = rowperpage;//每页几行，不判断错误参数，需要正确传递
  this.maxshow =  ((typeof maxshow == 'number' && maxshow > 2) && maxshow) || 2;//最少显示6个页号
  
  this.init = function(){
    this.pagelast = 1;//上次显示第几页
    this.pagecount = 1;//总共有几页
    this.pageturn = false;//不显示翻页
    this.setpagenow(pagenow);//当前第几页
  }
  this.setpagenow = function(pagenow){
    this.pagelast = this.pagenow;//保存上一个页号
    this.pagenow = pagenow;
    if(this.pagenow > this.pagecount)this.pagenow = this.pagecount;
    if(this.pagenow < 1)this.pagenow = 1;
  }
  
  //更改总行数
  this.settotlerow = function(totlerow, pagenow){
    //this.init();
    this.pagecount = Math.ceil(totlerow/this.rowperpage) || 1;
    this.setpagenow(pagenow);//当前第几页
    this.smartpage();
  }
  
  //智能显示页号：
  this.smartpage = function(){
    this.pageturn = false;//不显示翻页
    if(this.pagecount <= 1) return;
    this.pageturn = [];
    var _self = this;
    
    //总页数不够多，全部显示：
    if(this.pagecount <= this.maxshow){
      for(var i=1; i<=this.pagecount; i++) this.pageturn[i-1]=i;
      return;
    }
    
    //顺序插入一个页号
    function addpage(n){
      var length = _self.pageturn.length;
      if(n < 1)return;//页号太小
      if(n > _self.pagecount)return;//页号太大
      for(var i=0; i<length; i++){
        if(_self.pageturn[i] == n)return;
        if(n < _self.pageturn[i]){
          for(var j=length; j>i; j--) _self.pageturn[j] = _self.pageturn[j-1];//往后移一个，确保顺序
          _self.pageturn[i] = n;//插入到此处
          return;
        }
      }
      _self.pageturn[length] = n;//插入到最后边
      return;
    }
    
    addpage(this.pagenow - 1);//上页
    addpage(this.pagenow + 1);//下页
    if(this.pageturn.length < this.maxshow)addpage(1);//首页
    if(this.pageturn.length < this.maxshow)addpage(this.pagenow);//本页
    if(this.pageturn.length < this.maxshow)addpage(Math.round((this.pagenow + this.pagelast)/2));//跳转的中间页
    if(this.pageturn.length < this.maxshow)addpage(this.pagecount);//末页
    if(this.pageturn.length < this.maxshow){//再向前的中间页
      addpage(Math.round((this.pagenow + (
        this.pagenow > this.pagelast ? this.pagecount : 1
        ))/2)
      );
    }
    if(this.pageturn.length < this.maxshow)addpage(Math.round((this.pagenow + 1)/2));//前面的中间页
    if(this.pageturn.length < this.maxshow)addpage(Math.round((this.pagenow + this.pagecount)/2));//后面的中间页

    //最可能需要的页号
    function maxneedpage(){
      var length = _self.pageturn.length;
      var p0 = _self.pageturn[0];
      var dp = _self.pageturn[1] - _self.pageturn[0];//跳跃的页数
      for(var i=2; i<length; i++){
        var d = _self.pageturn[i] - _self.pageturn[i - 1];
        if(d > dp){//这里有更多的空白
          p0 =  _self.pageturn[i - 1];
          dp = d;
        }
      }
      if(dp > 1) return p0 + Math.round(dp / 2);
      return 0;
    }

    //再找拭，在加哪个页号好些
    while(this.pageturn.length < this.maxshow){
      var newpage = maxneedpage();
      if(!newpage)return;//无法加了，可能是算法问题了。
      addpage(newpage);
    }
  }
  
  this.init();
}


  
  
  //让异步函数有堆栈功能，以便顺序执行：
  function StackableFunction(callback){
    var fn = function(param){
      fn.cache.push(param);
      if(fn.cache.length > 1)return;//已经有数据在处理中，等他们处理结束后，会接着处理这个数据的。
      callback(fn);
    };
    fn.running = false;
    fn.cache = [];
    return fn;
  }
  
  //依赖堆栈的函数：
  var audio_serverId_to_localId = StackableFunction(function(cacheFn){
    if(cacheFn.cache.length == 0)return;//没有数据需要处理了。否则，现在前面的处理结束，要接着处理往后的数据。
    var self = arguments.callee;
    //将音频的服务器ID转换为本地ID：
    wx.downloadVoice({
      serverId: cacheFn.cache[0].audio.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        cacheFn.cache[0].audio.localId = res.localId; // 返回音频的本地ID
        if(cacheFn.cache.length == 1)cacheFn.cache[0].scope.$apply();
        cacheFn.cache.splice(0,1);
        self(cacheFn);
      }
      ,fail:function(e){
        //alert(JSON.stringify(e));
      }
    });
  });
  
  
  //依赖堆栈的函数：
  var audio_serverId_to_localId__ = function(cache){
    if(cache.length == 0)return;//没有数据需要处理了。否则，现在前面的处理结束，要接着处理往后的数据。
    var self = arguments.callee;
//alert(self);
    //将音频的服务器ID转换为本地ID：
    wx.downloadVoice({
      serverId: cache[0].audio.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        cache[0].audio.localId = res.localId; // 返回音频的本地ID
        cache[0].scope.$apply();
        cache.splice(0,1);
        self(cache);
      }
    });
  };
  


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          标语                                        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
/* ------------------------------------------------------------------------------
 *  图片幻灯片UI
 * 	
 * 	用法： $("#id1").PPT_POSTER();
 * 	
 * 	使用前，将图片或其它每页作为子元素添加到主元素中。如： 
 *
 * 	<div id='id1' style='width:320px;height:30px'>
 * 		<a href=#>标语1</a>
 * 		<a href=#>标语2</a>
 * 		<a href=#>标语3</a>
 *  </div>
 *	
 *-----------------------------------------------------------------------------------*/

(function ($) {
  $.fn.PPT_POSTER = function (options) {
    var D = $.extend($.fn.PPT_POSTER.defaults, options);
    init.call(this, D);
  }
  $.fn.PPT_POSTER.defaults = {
    ms:6000,
    speed:1000,
    css: "DJ-DJ_PICPPT"
  }
  function init(D) {
    var _self = $(this);
    var parent = _self.parent();
    var mw = _self.innerWidth();
    var mh = _self.innerHeight();
    //_self.css({overflow:'hidden', position:'relative'}); //position:absolute ; position:relative;

    D.ppt=[];

    _self.children().each(function(i){
      $(this).css({
        position:'absolute',
        "text-align":'center',
        top  : i&&mh,
        width: mw,
        height: mh
      });
      D.ppt.push($(this));
    });

    var n = 0;
    var N = D.ppt.length;
    if(N>1)setInterval(function(){
      D.ppt[n].animate({top:-mh},D.speed);
      n++; if(n>=N) n=0;
      D.ppt[n].css({display:'block'});
      D.ppt[n].css({top:mh});
      D.ppt[n].animate({top:0},D.speed);
    }, D.ms);
  }
})(jQuery);
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          定时器                                      ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
var TIMESPAN = {
    //时间转换为秒
    from : function(str){ return (new Date(str.replace(/\-/g, "/")).getTime()/1000).toFixed() },
    //这个时间已过去了几秒？
    passed : function(str){ return ((new Date().getTime() - new Date(str.replace(/\-/g, "/")).getTime())/1000).toFixed(); }
}
function AddTimer($scope, field, options) {
  var T = $scope[field] = {};
  T.timer = setInterval(function(){
    options.ontimer && options.ontimer();
  }, options.ms || 1000);
}
function AddTimerCountdown($scope, field, options) {
  var T = $scope[field] = {};
  T.date = new Date();
  T.timer = setInterval(function(){
    options.ontimer && options.ontimer();
  }, options.ms || 1000);
}


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          主控控件                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function main_APIController($scope, $http, fn_guest, fn_logged) {
  API.fn_guest = fn_guest || gotologin;
  $scope.API = API;
  $scope.USER = USER;
  API.$scope = $scope;
  
  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    }else {
      this.$apply(fn);
    }
  };
  //主对话框
  var maindlg = $scope.maindlg = {};
  function show_maindlg(options){
    options.text && $("#mainpagedialog .prompt").html(options.text);
    options.onshow && options.onshow($("#mainpagedialog .prompt"));
    maindlg.showing = true;
    maindlg.tpl = false;
    maindlg.btns = options.btns || false;
    maindlg.OKtext = options.OKtext || "确定";
    maindlg.CANCELtext = options.CANCELtext || "取消";
    maindlg.OK = function(scope){
      options.OK && options.OK();
    }
    maindlg.CANCEL = options.CANCEL && function(scope){
      options.CANCEL && typeof options.CANCEL=='function' && options.CANCEL();
    }
  }
  API.tips = function(s, options){
    show_maindlg({
      text: s,
      btns: []
    });
    !options && (options = {});
    if(options.delay){
      window.setTimeout(function(){
        options.onhide && options.onhide();
        maindlg.showing = false;
        $scope.$apply();
      }, options.delay);
    }
  }
  API.alert = function(s, OK, options){ 
    show_maindlg($.extend({
      onshow: function(div){
        div.html(s);
      },
      OK: OK
    }, options));
  }
  API.confirm = function(s, OK, CANCEL){ 
    show_maindlg({
      onshow: function(div){
        div.html(s);
      },
      OK: OK,
      CANCEL: CANCEL || 1
    });
  }
  
  //重新获取数据
  $scope.regeting = false;
  var fn_cache = [];//请求堆栈
  $scope.reget = function(fn_after){
    typeof fn_after == 'function' && fn_cache.push(fn_after);//请求先堆栈，待数据获取后执行。
    if ($scope.regeting) return;
    $scope.regeting = true;
    API.get("/user/getfullinfo", {}, {
      success: function(json){
        if(json.errcode == 0){
          API.setuserinfo(json.userinfo);
          //alert("已获取用户信息，设置分享");
          //处理请求堆栈
          while(fn_cache.length >0){
            (typeof fn_cache[0]=='function') && fn_cache[0](json);//堆栈先进先出
            fn_cache.splice(0,1);
          }
          //ng脏数据清洗
          $scope.$apply();
          $scope.regeting = false;
        }
        else API.fn_guest(); //用户现在是未成功登陆状态
      },
      error: function(){
        API.fn_guest();
      }
    });
  }
  //$scope.reget(fn_logged);
  
  $scope.usertypes = function(sep, user){
    user = user || API.userinfo;
    var s = [];
    if(user.userstate=='3')s.push('用户');
    if(user.expertstate=='3')s.push('专家');
    if(user.servicestate=='3')s.push('编导');
    return s.join(sep || ",");
  }

  $scope.logout = function(){
    if(API.iswx)return;
    API.setCookie("user_id", 0);
    API.setCookie("user_openid", "");
    API.setCookie("user_password", "");
    gotologin();
  }
  //申请激活
  $scope.activeaplly = function(){
    API.post({
      url: "/user/activeaplly",
      data: {usermodule: API.module},
      success: function(json){
        API.userinfo[API.module+'state'] = 1;
        API.isnotapplyed = false;
        $scope.$apply();
        tooltipsdelay($("#activestate"), "<hh5>已申请成功</hh5>", 2000);
      }
    });
  }
  //更新资料
  $scope.selectuserinfo = function(field, value){
    API.userinfo[field] = value;
    $scope.updateuserinfo(field);
  }
  //更新资料
  $scope.tttt = function(a){
    alert(a);
  }
  //更新资料
  $scope.updateuserinfo = function(field, istips){
    API.post({
      url: "/user/updateitem",
      data: {field: field, value: API.userinfo[field]},
      success: function(json){
        if( json.errcode !== 0){
          $scope.$apply();
          //tooltipsdelay( $("#userinfo-" + field), "<hh5>"+json.errmsg+"</hh5>", 2000);
          return;  
        }
        istips && tooltipsdelay($("#userinfo-" + field), "<hh5>已更新</hh5>", 2000)
      }
    });
  }
  // 
  $scope.tip = function(field, text){
    tooltipsdelay($("#userinfo-" + field), "<hh4>"+text+"</hh4>", 1000)
  }
  
  //利用微信播放声音：
  $scope.palyRecord = function(localId) {
    wx.playVoice({localId: localId});
  }
  //利用微信预览图片组：
  $scope.preview = function(pic, arr) {
    (API.iswx && wx.previewImage || $.previewImage)
    ({
      current: pic, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    });
  }
  $scope.previewself = function(pic) {
    (API.iswx && wx.previewImage || $.previewImage)({
      current: pic, // 当前显示图片的http链接
      urls: [pic] // 需要预览的图片http链接列表
    });
  }
  //相对路径的图片预览：
  $scope.previewlocal = function(piclocal, arrlocal) {
    var pic = SITE.root + piclocal;//因为API数据库中保存相对路径
    var arr = [];
    for(var i in arrlocal)arr.push(SITE.root + arrlocal[i]);
    (API.iswx && wx.previewImage || $.previewImage)({
      current: pic, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    });
  }
  
  $scope.urlEncode = function(url) {
    return encodeURIComponent(url);
  }
  
  // ━━━━━━━━━ 搜索 ━━━━━━━━━━━━━━━━━━━━
  API.quicksearchtext = GetQueryString("text");
  $scope.quicksearch = function() {
    API.search = {};
    API.quicksearching = API.quicksearchtext;
    API.post({
      url: "/search/search" ,
      data: {searchtext: API.quicksearching, page:1, pagesize:100},
      success: function(json){
        API.search.QA=json.QA;
        API.search.USER=json.USER;
        $scope.$apply();
      }
    });
    
    window.location.href = "#/frame/search?text=" + API.quicksearchtext;
  }
  // ------------------ 搜索 ---------------------------------------
  
}

//----------- CMouseAble --------------------------------------------------
function CMouseAble($box, options){
  var self = this;
  self.box = $box;
  self.bindobj = options.bindobj || $box;
  self.options = options;
  self.left = 0;
  self.down = 0;
  self.pressed = false;
  self.bindobj.bind("mousedown",function(event){ CMouseAble.onmousedown(self, event); })
  self.bindobj.bind("mousemove",function(event){ CMouseAble.onmousemove(self, event); })
  self.bindobj.bind("mouseup"  ,function(event){ CMouseAble.onmouseup  (self, event); })
  self.bindobj[0].addEventListener('touchstart', function(event) { CMouseAble.onmousedown(self, {screenX: event.changedTouches[0].pageX}); })
  self.bindobj[0].addEventListener('touchmove' , function(event) { CMouseAble.onmousemove(self, {screenX: event.changedTouches[0].pageX}); })
  self.bindobj[0].addEventListener('touchend'  , function(event) { CMouseAble.onmouseup  (self, {screenX: event.changedTouches[0].pageX}); })
}
CMouseAble.onmousedown = function(self, event){
  $(".sub", self.box).css("z-index", 6001);
  self.down = event.screenX;
  self.left = self.box.scrollLeft();
  self.pressed = true;
}
CMouseAble.onmousemove = function(self, event){
  if(self.pressed){
    self.box.scrollLeft(self.left - event.screenX + self.down);
  }
}
CMouseAble.onmouseup = function(self, event){
    self.pressed = false;
    self.left += self.down - event.screenX;
    if(self.left<=0 || !self.options.topmax || !self.options.topmax(self.left))$(".sub", self.box).css("z-index", 5999);
    self.options.onslideto && self.options.onslideto(self.left);
}
//----------- CMouseAble ----------------↑↑↑----------------------------------


function responseButton($scope, btn){
  var btn = $scope[btn];
  
  btn.text = btn.textnormal;
  var oldsuccess = btn.ajax.success;
  btn.ajax.success = function(json){
    btn.dsiable = false;
    //btn.text = btn.textnormal;
    oldsuccess && oldsuccess(json);
    $scope.$apply();
  }
  
  btn.click = function(){
    var canclick = (!btn.canclick && true) || btn.canclick()!==false;
    if(!canclick)return;
    btn.text = btn.responsing;
    btn.dsiable = true;
    window.setTimeout(function(){
      //btn.dsiable = false;
      btn.text = btn.textnormal;
      $scope.$apply();
    }, btn.delay);
    btn.data && (btn.ajax.data = btn.data());
    $.ajax(btn.ajax);
  }
}

