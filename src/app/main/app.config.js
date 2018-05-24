!(function (window, angular, undefined) {

  /**
   * 网站通用配置
   */
  window.theSiteConfig = angular.extend(
    {
      apiRoot: '../../../api-qgs/src/qgs', //本地的API
      apiRoot: 'https://api.esunion.com/store/master/src/store', //服务器正式版

      apiRoot_old: 'https://api.qinggaoshou.com/api-qgs-vers/2.0.0/src/api-old', //服务器正式版

      title: {
        hide: false,  // 默认是否隐藏上方标题栏
        text: '请高手' // 默认标题
      },

      wx_app: {
        web: { name: 'pgy-web', appid: 'wxffc089a88065e759' },
        wx: { name: 'pgy-wx', appid: 'wx3a807a2f301479ae' }
      },
      wx_authApiBase: 'https://esunion.com/bridge/wx-auth', //WX 授权 callback 域名限制的URI
      wx_markWxLoginCallback: 'cb_xd', //和后端API的约定字符串，在 /wx-login里用'
    },
    window.theSiteConfig
  );

})(window, angular);
