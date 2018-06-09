!(function (window, angular, undefined) {

  /**
   * 网站通用配置
   */
  angular.extend(angular.dj || (angular.dj = {}), (function () {
    var siteConfig = {

      apiRoot: window.location.origin + '/Laolin/api-core/src/cmoss/', //本地的API
      //apiRoot: 'https://api.jdyhy.com/cmoss-test-1.0/src/cmoss/', //服务器测试API
      //apiRoot: 'https://api.qinggaoshou.com/cmoss-master-1.0.0/src/cmoss/', //服务器预览版（最新版）
      //apiRoot: 'https://api.qinggaoshou.com/api-cmoss/master/open/', //服务器正式版

      assetsRoot: window.__assetsPath||'../assets',//可在本地部署静态文件 或 跨域部署静态文件

      wx_app: {
        web: { name: 'qgs-web', appid: 'wx8fb342a27567fee7' },
        wx: { name: 'qgs-mp', appid: 'wx93301b9f5ddf5c8f' }
      },
      //wx_authApiBase: 'https://qinggaoshou.com/api-eb', //WX 授权 callback 域名限制的URI
      wx_authApiBase: 'https://qinggaoshou.com/bridge/wx-auth', //WX 授权 callback 域名限制, 由此脚本处理桥接
      wx_markWxLoginCallback: 'cb_xd', //和后端API的约定字符串，在 /wx-login里用'
    }
    return {
      siteConfig,
    };
  })());

  angular.module('app-site-config', [])  .provider("SiteConfig", [function(){
    var siteConfig = angular.extend({apiRoot: './'}, angular.dj.siteConfig, window.theSiteConfig);
    if(!/\/$/.test(siteConfig.apiRoot)) siteConfig.apiRoot = siteConfig.apiRoot + '/';
    if(!siteConfig.apiRootUnit){
      siteConfig.apiRootUnit = siteConfig.apiRoot.match(/(.*)\/\w+\/$/)[1] + "/api-unit/";
    }
    if(!/\/$/.test(siteConfig.apiRootUnit)) siteConfig.apiRootUnit = siteConfig.apiRootUnit + '/';
    angular.extend(this, siteConfig);
    
    /**
     * 暴露数据
     */
    this.$get = [function () {
      return siteConfig;
    }];
  }]);
})(window, angular);
