!(function (angular, window, undefined) {
  var localStorage_KEY = window.theSiteConfig.localStorage_KEY || '__qgs_user_token__';

  angular.module('dj-login', ['ngRoute']);


  /**
   * 基本的用户登录票据和签名方法
   */
  function getUserToken(localStorage_KEY){
    var userToken = {
      timestampOffset: 0, // 时间偏差
      data: JSON.parse(localStorage.getItem(localStorage_KEY) || '{}'),
      /** 保存到 */
      save: data =>{
        localStorage.removeItem(localStorage_KEY);
        localStorage.setItem(localStorage_KEY, JSON.stringify(userToken.data = data));
      },
      /** 校准与服务器的时间偏差 */
      adjustTimestamp: (timestampServer) =>{
        var dt = new Date();
        var timestampHere = Math.round((dt.getTime() / 1000)) - 8 * 3600 - dt.getTimezoneOffset() * 60;//修正为东8区
        userToken.timestampOffset = timestampServer - timestampHere;
      },
      hasToken: () =>{
        return userToken.data && userToken.data.tokenid && userToken.data.token;
      },
      signParamString: () =>{
        var dt = new Date();
        var timestamp = Math.round((dt.getTime() / 1000)) - 8 * 3600 - dt.getTimezoneOffset() * 60;//修正为东8区
        var data = [
          'tokenid=' + userToken.data.tokenid,
          'timestamp=' + (timestamp + userToken.timestampOffset),
          'sign=' + md5(userToken.data.token + timestamp),
          'a=' + userToken.data.token + timestamp
        ]
        return data.join('&');
      },
      checkLogin: (loginUrlBase, fnLogged, fnNotLogged, times) =>{
        if(!userToken.hasToken()){
          return fnNotLogged();
        }
        var loginUrl = loginUrlBase + "?" + userToken.signParamString();
        userToken._reCheckLogin(loginUrl, fnLogged, fnNotLogged, 0);
      },
      _reCheckLogin: (loginUrl, fnLogged, fnNotLogged, times) =>{
        angular.dj.getJson(loginUrl, json => {
          if(json.errmsg == '时间不对'){
            userToken.adjustTimestamp(json.datas.timestamp);
            if(times >= 2) return fnNotLogged(); // 最多校准2次时间
            return userToken._reCheckLogin(loginUrlBase, fnLogged, fnNotLogged, (+times||0) + 1 )
          }
          if(json.datas && json.datas.uid){
            return fnLogged();
          }
          else{
            return fnNotLogged();
          }
        });
      }
    };
    return userToken;
  }
  angular.extend(angular.dj || (angular.dj = {}), (function(){
    var userToken = getUserToken(localStorage_KEY);
    return {
      userToken
    }
  })());


  /**
   * 基本的用户登录票据和签名方法, 转换为工厂
   */
  angular.module('dj-login').provider("UserToken", [function(){

    function reload(){
      return getUserToken(localStorage_KEY);
    }

    this.reload = reload;
    /**
     * 暴露数据
     */
    this.$get = [function () {
      return {reload};
      var userToken = getUserToken(localStorage_KEY);
      return userToken
    }];

  }])
})(angular, window);
