!(function (window, angular, undefined) {

  /**
   * 网站通用配置
   */
  angular.extend(angular.dj || (angular.dj = {}), (function () {
    var siteConfig = {

      //apiRoot: 'https://api.qinggaoshou.com/api-eb', //一般的API(旧)
      //apiRoot: 'https://qinggaoshou.com/dev/api-linjh/api-core/src', //服务器测试API(旧)
      //apiRoot: 'https://qinggaoshou.com/dev/laolin/cmoss-dev-api/open', //服务器测试API
      apiRoot: 'http://pgy/Laolin/api-core/src', //本地的API
      //apiRoot: 'https://api.qinggaoshou.com/api-cmoss/open', //生产用的API

      wx_app: {
        web: { name: 'qgs-web', appid: 'wx8fb342a27567fee7' },
        wx: { name: 'qgs-mp', appid: 'wx93301b9f5ddf5c8f' }
      },
      wx_authApiBase: 'https://qinggaoshou.com/api-eb', //WX 授权 callback 域名限制的URI
      wx_markWxLoginCallback: 'cb_xd', //和后端API的约定字符串，在 /wx-login里用'
    }
    return {
      siteConfig,
    };
  })());

  angular.module('app-site-config', [])  .provider("SiteConfig", [function(){
    this.apiRoot = './';
    angular.extend(this, angular.dj.siteConfig, window.theSiteConfig)
    /**
     * 暴露数据
     */
    this.$get = [function () {
      var siteConfig = angular.extend({}, angular.dj.siteConfig, window.theSiteConfig)
      return siteConfig;
    }];
  }]);
})(window, angular);
