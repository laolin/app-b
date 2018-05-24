!(function (window, angular, undefined) {

  var theSiteConfig = window.theSiteConfig = angular.extend({
    apiRoot: './',
    localStorage_KEY_UserToken: '__qgs_user_token__'
  }, window.theSiteConfig);


  var theModule = angular.module('dj-service');

  theModule.provider("SiteConfig", [function () {
    if (!/\/$/.test(theSiteConfig.apiRoot)) theSiteConfig.apiRoot = theSiteConfig.apiRoot + '/';
    if (!/\/$/.test(theSiteConfig.apiRoot_unit)) theSiteConfig.apiRoot_unit = theSiteConfig.apiRoot_unit + '/';
    angular.extend(this, theSiteConfig);
    /**
     * 暴露数据
     */
    this.$get = [function () {
      return theSiteConfig;
    }];
  }]);



  /**
   * 基本的用户登录票据和签名方法, 
   */
  theModule.provider("UserToken", function () {

    var UserToken = (function () {
      function UserToken() {
        this.data = {};
        this.timestampOffset = 0; // 时间偏差
      }
      UserToken.prototype = {
        load: function () {
          var k = theSiteConfig.localStorage_KEY_UserToken;
          this.data = JSON.parse(localStorage.getItem(k) || '{}');
          return this;
        },
        /** 保存到 */
        save: function (data) {
          var k = theSiteConfig.localStorage_KEY_UserToken;
          localStorage.removeItem(k);
          localStorage.setItem(k, JSON.stringify(this.data = data));
          return this;
        },
        hasToken: function () {
          return this.data && this.data.tokenid && this.data.token;
        },
        /** 校准与服务器的时间偏差 */
        adjustTimestamp: function (timestampServer) {
          var dt = new Date();
          var timestampHere = Math.round((dt.getTime() / 1000));
          this.timestampOffset = timestampServer - timestampHere;
        },
        /** 用于 http 签名 */
        signToken: function () {
          this.load()
          var tokenid = this.data.tokenid;
          var token = this.data.token;
          if (!tokenid || !token) {
            return {};
          }
          var dt = new Date();
          var timestamp = Math.round((dt.getTime() / 1000));
          timestamp += this.timestampOffset; // 修正误差
          var sign = md5(token + timestamp);
          return { tokenid, timestamp, sign };
        },

      }

      return UserToken;
    })();

    var userToken = new UserToken();
    function reload(){
      return userToken.load();
    }
    function save(data){
      return userToken.save(data);
    }

    var theFactory = {
      userToken,
      reload,
      save,
    };


    /**
     * 暴露数据
     */
    angular.extend(this, theFactory);
    this.$get = function () {
      return theFactory;
    };
  })




  /** 签名配置 */
  theModule.config(['signProvider', 'SiteConfigProvider', 'UserTokenProvider', function (signProvider, SiteConfigProvider, UserTokenProvider) {
    signProvider.setApiRoot(SiteConfigProvider.apiRoot);
    signProvider.registerDefaultRequestHook((config, mockResponse) => {
      return {
        url: SiteConfigProvider.apiRoot + config.url,
        post: angular.extend({}, UserTokenProvider.reload().signToken(), config.data)
      }
    });
  }]);
})(window, angular);
