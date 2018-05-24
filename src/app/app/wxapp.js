
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃               初始化                                                         ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  /*
  * 注意：
  * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
  * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
  * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
  *
  * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
  * 邮箱地址：weixin-open@qq.com
  * 邮件主题：【微信JS-SDK反馈】具体问题
  * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
  */
!(function (){
  window.WXAPP = {
    iswx: navigator.userAgent.indexOf("MicroMessenger") > 0,//（自动检测）是否是微信客户端？

    // ------------------------ 基础参数 ------------------------
    configAPI: "api/wx/getwxconfig",
    SITE_root: window.location.href.substr(0, window.location.href.indexOf("/", 10)),
    defaultShare:{
      title : "更专业的人做更专业的事",// 分享标题
      desc  : "土木领域 海量专家 资源与您共享! 搞不定，请高手!",// 分享描述
      link  : SITE.root + "/qgs/wx",// 分享链接
      imgUrl: "http://qinggaoshou.com/qgs/images/logo-128.png"// 分享图标
    },
    autoLink: function(){
      return SITE.root + "/qgs/wx?" +
        (API.userinfo && API.userinfo.id && ("share_id="+API.userinfo.id+"&") || "") +
        ("hash=" + encodeURIComponent(window.location.hash))
    },
    onSendToFriend: function(is_success){},
    onSharePub: function(is_success){},

    // ------------------------ 状态 ------------------------
    state: false,

    // ------------------------ 接口 ------------------------
    init: function(success_wx){
      if( !WXAPP.iswx ) return;
      //不重复初始化：
      if(WXAPP.state == "success") return success_wx();
      //消除微信重定向残余参数
      var n = window.location.href.indexOf("?code=", 10);//消除微信重定向残余参数
      n<0 && (n = window.location.href.indexOf("#", 10));
      var the_url = n>0 && window.location.href.substr(0, n) || window.location.href;
      $.ajax({
        url: WXAPP.configAPI + "?url=" + window.location.origin + window.location.pathname,//the_url, //这个请求不签名了
        dataType: "json",
        success: function(json){
            //alert(JSON.stringify(json));
          if(json.errcode == 0){
            //alert(JSON.stringify(wx));
            wxconfig(json.config);
            wx.ready(function () {
              WXAPP.state = "success";
              WXAPP.reshare();
              success_wx();
            });
          }
        }
      });
    },
    setShare: function(options){
      !options && (options={})
      !options.title  && (options.title  = WXAPP.defaultShare.title ); // 分享标题
      !options.desc   && (options.desc   = WXAPP.defaultShare.desc  ); // 分享描述
      !options.link   && (options.link   = WXAPP.autoLink()         ); // 分享链接
      !options.imgUrl && (options.imgUrl = WXAPP.defaultShare.imgUrl); // 分享图标
      !options.shareTitle  && (options.shareTitle  = options.title  ); // 发送到朋友圈标题
      WXAPP.onSharePub = options.onSharePub;
      WXAPP.onSendToFriend = options.onSendToFriend;
      WXAPP.init(function(){ WXAPP.reshare(options); });
    },

    // ------------------------ 接口 ------------------------
    reshare: function(options){
      var shareed = true;
      !options && (options=WXAPP.defaultShare)
      //分享到朋友圈
      wx.onMenuShareTimeline({
        title:  options.shareTitle  || options.title, // 分享标题
        link:   options.link   , // 分享链接
        imgUrl: options.imgUrl , // 分享图标
        success: function () { 
          WXAPP.onSharePub && WXAPP.onSharePub(true);
        },
        cancel: function () { 
          WXAPP.onSharePub && WXAPP.onSharePub(false);
        }
      });
      //分享给朋友
      wx.onMenuShareAppMessage({
        title:  options.title  , // 分享标题
        desc:   options.desc   , // 分享描述
        link:   options.link   , // 分享链接
        imgUrl: options.imgUrl , // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
          WXAPP.onSendToFriend && WXAPP.onSendToFriend(true);
        },
        cancel: function () { 
          WXAPP.onSendToFriend && WXAPP.onSendToFriend(false);
        }
      });
    }
  }

  function wxconfig(options){
    //wx.error(function(res){  alert(JSON.stringify(res)); });
    wx.config({
      debug: false,
      appId: options.appId,
      timestamp: options.timestamp,
      nonceStr: options.nonceStr,
      signature: options.signature,
      jsApiList: [
        // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard' //*/
      ],
      success: function(res){
        alert("wxconfig success!\n" + JSON.stringify(res));
      },
      error: function(res){
        alert("wxconfig error:\n" + JSON.stringify(res));
      }
    });
  }

  function readywx(success_wx){
    //alert("readywx");
    //alert(JSON.stringify(API.share));
    
    var the_app = API;
    var shareed = false;
    
    the_app.reshare = function(options){
      shareed = true;
      !options && (options=the_app.main_share)
      //分享到朋友圈
      wx.onMenuShareTimeline({
        title:  options.title  , // 分享标题
        link:   options.link   , // 分享链接
        imgUrl: options.imgUrl , // 分享图标
        success: function () { 
          the_app.wx.onSharePub && the_app.onSharePub(true);
        },
        cancel: function () { 
          the_app.wx.onSharePub && the_app.onSharePub(false);
        }
      });
      
      //分享给朋友
      wx.onMenuShareAppMessage({
        title:  options.title  , // 分享标题
        desc:   options.desc   , // 分享描述
        link:   options.link   , // 分享链接
        imgUrl: options.imgUrl , // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
          the_app.wx.onSendToFriend && the_app.onSendToFriend(true);
        },
        cancel: function () { 
          the_app.wx.onSendToFriend && the_app.onSendToFriend(false);
        }
      });
    }
    
    wx.ready(function () {
      !shareed  && the_app.reshare();
      success_wx();
    });
  }
})();
