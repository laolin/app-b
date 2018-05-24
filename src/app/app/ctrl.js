// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          主控控件                                    ┃
// ┃                                                      ┃
// ┃  依赖： APP对象                                      ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
(function(){
  var APP = API, CTRLS = {}, DATAS, SIGN;

  var AUTO_CTRL = window.AUTO_CTRL = function(state_name, options, fn){
    if(typeof fn == 'function'){
      options = {fn:fn, options:{datas: options}};
    }
    else if(typeof options == 'function'){
      options = {fn: options, options:{}};
    }
    !options.options && (options.options={});
    CTRLS[state_name] = options;
  }
  AUTO_CTRL.init = function($scope, $rootScope, $state, options) {
    $scope.DATAS = DATAS;
    $scope.APP = $scope.API = APP;
    APP.$scope = $scope;
    !options && (options={});
    AUTO_CTRL.options = options;
    init_SIGN(options.SIGN);
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

    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
      onStateChange($scope, toState.name);
    });
    onStateChange($scope, $state.$current.self.name);
  };


  AUTO_CTRL.invalidate = 
  AUTO_CTRL.onStateChange = function($scope){
    var ctrl = CTRLS[$scope.state.join(".")];
    !(ctrl && ctrl.options.wx_share) && WXAPP && WXAPP.setShare();//使用默认分享
    if(ctrl){
      var datas = ctrl.options.datas || ['me'];
      $scope.ajaxing = true;
      get_data({
        datas: datas,
        success:function(ajaxed){
          if(ctrl.options.require_login && (!DATAS.me || DATAS.me.changed)){
            APP.setCookie('return_url', window.location.href);
            APP.setCookie('user_id', "");//为了交给主页处理，且不会造成循环，取消cookie（如果跨域跳转，可能造成循环）。
            window.location.hash = "#/login";
            return;
          }
          $scope.ajaxing = false;
          ctrl.fn($scope);
          if(ajaxed)$scope.$apply();
          window.setTimeout(function(){$("#auto_active").focus();},10);
        }
      });
    }
  };

  function onStateChange($scope, state_name){
    $scope.state = state_name.split(".");
    AUTO_CTRL.options.beforeStateChange && AUTO_CTRL.options.beforeStateChange($scope);
    AUTO_CTRL.onStateChange($scope);
    AUTO_CTRL.options.afterStateChange && AUTO_CTRL.options.afterStateChange($scope);
  }


  DATAS = window.DATAS = {
    clear: function(){
      for(var k in DATAS)if(typeof DATAS[k] != 'function'){
        delete DATAS[k];
      }
    },
    //设置模块
    setmodule: function(en, en2){
      if( en != 'user' && en != 'expert' && en != 'service'
       && en2!= 'user' && en2!= 'expert' && en2!= 'service' )return;
      if(!this.hasactivemodule())this.module = "user";
      else if(this.hasmodule(en) && this.module == en)return;
      else if(this.hasmodule(en2) && this.module == en2)return;
      else if(this.hasmodule(en))this.module = en;
      else if(this.hasmodule(en2))this.module = en2;
      else if(this.hasmodule("service")) this.module = "service";
      else if(this.hasmodule("expert")) this.module = "expert";
      else this.module = "user";
    },
    
    //是否已有激活的模块
    hasactivemodule: function(en){
      if(!this.me)return false;
      for(var module in {user:1, service:1, expert:1}){
        if(en && module==en && this.me[module+'state']=='3')return true;
        if(!en && this.me[module+'state']=='3')return true;
      }
      return false;
    },
    
    //是否还有其它模块
    hasmoremodule: function(){
      if(!this.me)return false;
      for(var module in {user:1, service:1, expert:1}){
        if(module != this.module && this.me[module+'state']=='3')return true;
      }
      return false;
    },
    
    //是否已激活指定模块
    hasmodule: function(module){
      if(!this.me)return false;
      return  this.me[module+'state']=='3';
    },

    hassomeright: function(rights){
      for(var i in rights)if(this.hasright(rights[i]))return true;
      return false;
    },

    hasallright: function(rights){
      for(var i in rights)if(!this.hasright(rights[i]))return false;
      return true;
    },

    hasright: function(right){
      if(!this.me || !this.me.attr|| !this.me.attr.d || !this.me.attr.d["权限"])return false;
      for(var i in this.me.attr.d["权限"]){
        if(this.me.attr.d["权限"][i] == "超级管理员")return true;
        if(this.me.attr.d["权限"][i] == right)return true;
      }
      return false;
    }
  };
  var set_data = DATAS.set_data = function(datas){
    for(var k in datas){
      DATAS[k] = datas[k];
      DATAS[k].changed = false;
    }
  }
  function get_data(options){
    //需要的数据
    !options.datas && (options.datas = []);
    var datas = [];
    for(var k in options.datas){
      var name = options.datas[k];
      if(!DATAS[name] || DATAS[name].changed)datas.push(options.datas[k]);
    }
    //如果原来已有数据：
    if(datas.length == 0){
      options.success && options.success(0);
      return;
    }
    //需要请求数据：
    SIGN.post("/app/getuserdatas", {datas: datas }, {
      success:function(json){
        set_data(json.datas);
        options.success && options.success(1);
      }
    });
  }
  
  function init_SIGN(old_SIGN){
    SIGN = window.SIGN = old_SIGN || {
      d: -1234567890,//可以保证无效
      sync: function(fn_after){
        $.ajax({
          url:APP.APIroot+"/app/gettimespan",
          success: function(data){
            var t_server = toNumber(data);
            if(t_server < 1434567890){
              fn_after && fn_after(false);
              return;
            }
            var t = Math.floor(new Date().getTime()/1000);
            SIGN.d = t_server - t;
            fn_after && fn_after(true);
          }
        });
      },

      get: function(url, data, options, password){
        !data && (data = {});
        options.dataType = "json";
        options.url = APP.APIroot + url;
        var d = [];
        for(var k in data)d.push(k + "=" + data[k]);
        d.length>0 && (options.url  += (url.indexOf("?")>0 ? "&":"?") + d.join("&") );
        if(SIGN.d <= -1234567890){
          SIGN.sync(function(){
            $.ajax(options);
          });
        }else{
          $.ajax(options);
        }
      },
      post: function(url, data, options){
        !data && (data = {});
        var d = {d: JSON.stringify(data)};
        options.url = APP.APIroot + url;
        options.type = "POST";
        options.dataType = "json";
        options.data = d;
        if(SIGN.d <= -1234567890){
          SIGN.sync(function(){
            SIGN.sign(d);
            $.ajax(options);
          });
        }else{
          SIGN.sign(d);
          $.ajax(options);
        }
      },
      sign: function(data, password){
        !password && (password=APP.getCookie("user_password"));
        if(password.length<16)password = APP.MD5(password);
        var d = [password];
        data.timespan = Math.floor(new Date().getTime()/1000) + SIGN.d;
        if(APP.getCookie("user_id"))data.uid = APP.getCookie("user_id");
        //alert("password="+password +"\n\n"+ JSON.stringify(data));
        for(var k in data)k != 'sign' && d.push((k+"=").toLowerCase() + data[k]);
        d.sort();
        var s = encodeURIComponent(d.join("&"));
        data.sign = MD5(s);
        return data;
      }
    }
  }


})();



// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          密码异或                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function XORMD5(a, b){
  var N={"0":0, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "A":10, "B":11, "C":12, "D":13, "E":14, "F":15};
  var table = "0123456789ABCDEF".split("");
  var c = [];
  for(var i=0; i<32; i++){
    c[i] = table[N[a.substr(i,1)] ^ N[b.substr(i,1)]];
  }
  return c.join("");
}