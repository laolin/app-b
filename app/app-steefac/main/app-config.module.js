!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config', [])

  theConfigModule.provider("SiteConfig", [function(){
    console.log('初始化配置')
    this.apiRoot = './';
    angular.extend(this, appbCfg, window.theSiteConfig)
    /**
     * 暴露数据
     */
    this.$get = ['$http', function ($http) {
      console.log('获取配置', $http)
      return angular.extend({}, appbCfg, window.theSiteConfig)
    }];
  }]);

  /** 签名配置 */
  theConfigModule.config(['signProvider', 'SiteConfigProvider',  function (signProvider, SiteConfigProvider) {

    // 需要验证身份的 api 对应的 url, 已带验证身份用的 queryStr
    function urlSign(api, call) {
      var param = signParam(api, call || '');
      if (!param) return '';
      var url = SiteConfigProvider.apiRoot + "/" + api + "/" + call;
      var queryString = Object.keys(param).map(k => {
        return k + "=" + encodeURIComponent(param[k]);
      })
        .join('&');
      return url + '?' + queryString;
    }
    /**
     *  返回签名需要的参数
     */
    function signParam(api, call) {
      var KEY_USERDATA = SiteConfigProvider.keyUserData;
      var userData = JSON.parse(window.localStorage.getItem(KEY_USERDATA) || '{}');
      var uid = userData.uid;
      var tokenid = userData.tokenid;
      var token = userData.token;
      console.log("签名数据：", api, call, uid , token , timestamp);
      if (!uid || !tokenid || !token || !api) {
        return false;
      }
      var dt = new Date();
      var timestamp = Math.round((dt.getTime() / 1000)) - 8 * 3600 - dt.getTimezoneOffset() * 60;//修正为东8区
      console.log(api, call, uid , token , timestamp);
      var api_signature = md5(api + call + uid + token + timestamp);
      return { uid, tokenid, timestamp, api_signature };
    }

    signProvider.defaults.root = "http://pgy.com/dd/pre_"
    signProvider.defaults.sign = function (api, call, SingedRequest) {
      console.log("签名....");
      var calls = call.split('/')
      var url = urlSign(api, calls[0]);
      return SingedRequest(url, {});
    }
    // signProvider.defaults.onpost.push(function (api, call, data, signedUrl, postData) {
    //   console.log('拦截api，模拟处理！', api, call, data, signedUrl, postData);
    //   return { signedUrl, postData }
    // });
  }]);

  theConfigModule.config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push("http2sign");
  }])
  //___________________________________
})(angular, window);
