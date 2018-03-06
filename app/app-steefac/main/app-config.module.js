!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config', ['app-site-config', 'dj-login'])


  /** 签名配置 */
  theConfigModule.config(['signProvider', 'SiteConfigProvider', 'UserTokenProvider', function (signProvider, SiteConfigProvider, UserTokenProvider) {

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
      var userToken = UserTokenProvider.reload()
      var uid = userToken.data.uid;
      var tokenid = userToken.data.tokenid;
      var token = userToken.data.token;
      console.log("签名数据：", api, call, uid, token, timestamp);
      if (!tokenid || !token || !api) {
        return false;
      }
      var dt = new Date();
      var timestamp = Math.round((dt.getTime() / 1000)) - 8 * 3600 - dt.getTimezoneOffset() * 60;//修正为东8区
      console.log(api, call, uid, token, timestamp);
      //var api_signature = md5(api + call + uid + token + timestamp);
      //return { uid, tokenid, timestamp, api_signature, sign };
      var sign = md5(token + timestamp);
      return { uid, tokenid, timestamp, sign };
    }

    signProvider.defaults.root = SiteConfigProvider.apiRoot;
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

  theConfigModule.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push("http2sign");
  }])
  //___________________________________
})(angular, window);
