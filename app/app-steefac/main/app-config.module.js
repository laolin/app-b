!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config', [])

  /** 签名配置 */
  theConfigModule.config(['signProvider', function (signProvider) {

    // 需要验证身份的 api 对应的 url, 已带验证身份用的 queryStr
    function urlSign(api, call) {
      var param = signParam(api, call || '');
      if (!param) return '';
      var url = appbCfg.apiRoot + "/" + api + "/" + call;
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
      var KEY_USERDATA = appbCfg.keyUserData;
      var userData = JSON.parse(window.localStorage.getItem(KEY_USERDATA) || '{}');
      var uid = userData.uid;
      var tokenid = userData.tokenid;
      var token = userData.token;
      if (!uid || !tokenid || !token || !api) {
        return false;
      }
      var dt = new Date();
      var timestamp = Math.round((dt.getTime() / 1000)) - 8 * 3600 - dt.getTimezoneOffset() * 60;//修正为东8区
      var api_signature = md5(api + call + uid + token + timestamp);
      return { uid, tokenid, timestamp, api_signature };
    }

    signProvider.defaults.root = "http://pgy.com/dd/pre_"
    signProvider.defaults.sign = function (api, call) {
      var calls = call.split('/')
      var url = urlSign(api, calls[0]);

      return {
        url: url, // 这将使得 signProvider.defaults.root 无效
        post: {}
      };
    }
    // signProvider.defaults.onpost.push(function (api, call, data, signedUrl, postData) {
    //   console.log('拦截api，模拟处理！', api, call, data, signedUrl, postData);
    //   return { signedUrl, postData }
    // });
  }]);

  //___________________________________
})(angular, window);
