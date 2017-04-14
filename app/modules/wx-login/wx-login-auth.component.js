'use strict';
(function(){

//和后端API的约定字符串
var MARK_API_CALLBACK=appbCfg.markWxLoginCallback;
var idWxLoginDiv='wx-lg_cnt_'+(+new Date());

angular.module('wx-login')
.component('wxLoginAuth',{
  template: '<div id="'+idWxLoginDiv+'" class="text-center">Loading weixin ...</div>',  
  bindings: {
    pageTo: '<',
    appData: '<'
  },
  controller:['$scope','$location','$log',
    function($scope,$location,$log) {
      var ctrl=this;
      this.$onInit= function() {
        var appData=ctrl.appData;
        var pageTo=ctrl.pageTo;
        if(!pageTo)pageTo='/';
        if(appData.userData.token) {
          $location.path( pageTo );
          return;
        }
        var para1=btoa(location.href.split("#")[0]+"#!/wx-callback");
        para1=para1.replace('/','_');//由于 base64的第64个字符是 '/'，要替换为 '_'
        var para2=btoa(pageTo);
        var api_wx=appData.appCfg.apiWxAuth+ "/bindwx/callback_bridge/" +
              para1 + '/'+para2;
        $log.log('pageTo',pageTo,api_wx);
        var inx=appData.isWeixinBrowser?1:0;
        
        //1: 在微信里打开
        if(inx) {
           var wxAuth=
           'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
           appData.appCfg.wxApp[inx].id + 
           '&redirect_uri=' + api_wx +
           '&response_type=code&scope=snsapi_userinfo&state=' + 
           MARK_API_CALLBACK+"~"+appData.appCfg.wxApp[inx].name + 
           '#wechat_redirect';
           location.href=wxAuth;
          return;
        }
        
        //2：不在微信里打开

        var wx_src="https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";

        if(typeof(WxLogin)=='undefined') {
          jQuery.getScript( wx_src , _wx_login )
        } else {
          _wx_login();
        }
          
        function _wx_login() {

          var obj = new WxLogin({
            id:idWxLoginDiv, 
            appid: appData.appCfg.wxApp[inx].id,
            scope: "snsapi_login", 
            
            redirect_uri: api_wx , 
            state: MARK_API_CALLBACK+"~"+appData.appCfg.wxApp[inx].name,
            style: "",
            href: ""
          });
        }
      }
    }
  ]
})


//________________________
})();
