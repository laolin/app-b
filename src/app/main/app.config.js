!(function (window, angular, undefined) {

  /**
   * 网站通用配置
   */
  window.theSiteConfig = angular.extend(
    {
      localStorage_Token_KEY: '__qgs_token__',

      /** 早期版本仍使用的 api 地址 */
      apiRoot_old: 'https://api.qinggaoshou.com/api-qgs-vers/2.0.0/src/api-old', //服务器正式版
      apiRoot_old: '../../api-qgs/src/api-old', // 本地

      /** 新版本增加的 api 地址 */
      apiRoot: 'https://api.esunion.com/store/master/src/store', //服务器正式版
      apiRoot: '../../api-qgs/src/qgs', //本地的API

      /** 微服务器地址 */
      apiRoot_unit: 'https://api.qinggaoshou.com/api-unit-server/ver-1.0.0', //微服务器地址

      /** 默认的图片地址根目录 */
      IMG_ROOT: 'https://qinggaoshou.com',



      title: {
        hide: false,  // 默认是否隐藏上方标题栏
        text: '请高手' // 默认标题
      },

      wx_share: {
        title: "更专业的人做更专业的事",
        desc: "土木领域 海量专家 资源与您共享! 搞不定，请高手!",
        imgUrl: "https://qinggaoshou.com/qgs/images/logo-128.png",
        lineLink: location.origin + location.pathname,
      },

      wx_app____PGY: {
        web: { name: 'pgy-web', appid: 'wxffc089a88065e759' },
        wx: { name: 'pgy-wx', appid: 'wx3a807a2f301479ae' }
      },
      wx_app: {
        web: { name: 'qgs-web', appid: 'wx8fb342a27567fee7' },
        wx: { name: 'qgs-mp', appid: 'wx93301b9f5ddf5c8f' }
      },
      wx_authApiBase___PGY: 'https://esunion.com/bridge/wx-auth', //WX 授权 callback 域名限制, 由此脚本处理桥接
      wx_authApiBase: 'https://qinggaoshou.com/bridge/wx-auth', //WX 授权 callback 域名限制, 由此脚本处理桥接
      wx_markWxLoginCallback: 'cb_xd', //和后端API的约定字符串，在 /wx-login里用'
    },
    window.theSiteConfig
  );

})(window, angular);
