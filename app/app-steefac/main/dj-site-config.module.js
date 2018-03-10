!(function (window, angular, undefined) {

  /**
   * 网站通用配置
   */
  angular.extend(angular.dj || (angular.dj = {}), (function () {
    var siteConfig = {

      apiRoot: '/Laolin/api-core/src/cmoss', //本地的API
      //apiRoot: 'https://api.jdyhy.com/cmoss-test-1.0/src/cmoss', //服务器测试API
      //apiRoot: 'https://api.qinggaoshou.com/api-cmoss/preview/open', //服务器预览版（最新版）
      //apiRoot: 'https://api.qinggaoshou.com/api-cmoss/master/open', //服务器正式版

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
