!(function (angular, window, undefined) {


  /**
   * 微信支付功能拦截
   */
  var theModule = angular.module('wx-jssdk');

  theModule.factory("WxPayH5", ['$http', '$q', 'sign', 'WxJssdk', function ($http, $q, sign, WxJssdk) {
    /**
     * 微信环境下，请求微信支付
     * @param {Object} options.orderParam :支付参数
     * @param {Function} options.checkPay :检查是否成功的回调函数，参数{url, pay_order, api_CheckPay}, 默认由本函数弹框
     * @param {String} options.api_QrCode :支付二维码的api地址
     * @param {String} options.api_CheckPay :检查是否成功的api地址
     */
    function WxPayH5(options) {
      console.log('微信支付功能拦截');
      return WxJssdk.initWx().then(wx => {
        return requireWxPay(wx, options);
      });
    }

    function requireWxPay(wx, options) {
      var orderParam = options.orderParam || options;
      var checkPay = options.checkPay || defaultCheckPay;
      var api_payParam = options.api_payParam || 'wxpay/recharge';
      var api_CheckPay = options.api_CheckPay || 'wxpay/checkpay';

      var deferred = $q.defer();


      return $http.post(api_payParam, orderParam).then(json => {
        var pay_order = { openid: json.openid, orderid: json.orderid };
        checkPay(deferred, pay_order, api_CheckPay);
        //调用支付，可以在循环测试之后，因为测试要在1秒之后才开始。
        wx.chooseWXPay({
          timestamp: json.js.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: json.js.nonceStr, // 支付签名随机串，不长于 32 位
          package: json.js.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: json.js.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: json.js.paySign, // 支付签名/
          complete: function (res) {
            //alert("invoke:" + JSON.stringify(res));
            if (res.err_msg != "get_brand_wcpay_request:ok") {
              //通知JS已取消支付，这将结束循环测试。
              deferred.reject("user cancled");
            }
          }
        });
      });
      return deferred.promise;
    }

    /**
     * 默认检查：是否支付成功
     * @param {String} deferred 原来的承诺, 当检查到支付成功，兑现该承诺
     * @param {Object} pay_order 支付订单
     * @param {String} api_CheckPay 检查支付请求地址
     */
    function defaultCheckPay(deferred, pay_order, api_CheckPay) {
      // 定时循环检查, 是否支付成功
      var timerId = window.setInterval(() => {
        // 已经有承诺了, 就退出定时循环
        if (deferred.promise.$$state.status) {
          window.clearInterval(timerId);
          return;
        }
        $http.post(api_CheckPay, pay_order).then(json => {
          deferred.resolve(sing.OK({ url })); // deferred.promise.status=1
        }).catch(e => {
          // 失败，就再循环
        });
      }, 1000);
    }

    return WxPayH5;

  }]);

  theModule.factory("WxPayQrCode", ['$http', '$q', 'sign', 'WxJssdk', 'SiteConfig', 'UserToken', function ($http, $q, sign, WxJssdk, SiteConfig, UserToken) {
    /**
     * 请求微信二维码支付
     * @param {Object} options.orderParam :支付参数
     * @param {Function} options.checkPay :检查是否成功的回调函数，参数{url, pay_order, api_CheckPay}, 默认由本函数弹框
     * @param {String} options.api_QrCode :支付二维码的api地址
     * @param {String} options.api_CheckPay :检查是否成功的api地址
     */
    function WxPayQrCode(options) {
      var orderParam = options.orderParam || options;
      var checkPay = options.checkPay || defaultCheckPay;
      var api_QrCode = options.api_QrCode || 'wxpay/getqrpay2url';
      var api_CheckPay = options.api_CheckPay || 'wxpay/checkpay';

      return $http.post(api_QrCode, orderParam).then(json => {
        var url = json.url2;
        var pay_order = json.pay_order;
        return checkPay(url, pay_order, api_CheckPay);
      });
    }


    /**
     * 默认检查：是否支付成功
     * @param {String} url 支付二维码
     * @param {Object} pay_order 支付订单
     * @param {String} api_CheckPay 支付请求地址
     */
    function defaultCheckPay(url, pay_order, api_CheckPay) {
      var deferred = $q.defer();
      var url = "http://paysdk.weixin.qq.com/example/qrcode.php?data=" + encodeURIComponent(url);
      $http.post("显示对话框/alert", [{
        template: `
          <djui-dialog-body class="ww25 text-center">
            <img class="ww15em" src="${url}">
            <br>微信扫一扫支付
          </djui-dialog-body>
        `,
        param: {
          url: url
        }
      }]).then(json => {
        deferred.reject("user cancled");
      }).catch(e => {
        deferred.reject("user cancled");
      })

      // 定时循环检查, 是否支付成功
      var timerId = window.setInterval(() => {
        // 已经有承诺了, 就退出定时循环
        if (deferred.promise.$$state.status) {
          window.clearInterval(timerId);
          return;
        }
        $http.post(api_CheckPay, pay_order).then(json => {
          deferred.resolve(sing.OK({ url })); // deferred.promise.status=1
        }).catch(e => {
          // 失败，就再循环
        });
      }, 1000);
      return deferred.promise;
    }

    return WxPayQrCode;

  }]);


  theModule.run(['$http', '$q', 'sign', 'WxJssdk', 'WxPayH5', 'WxPayQrCode', function ($http, $q, sign, WxJssdk, WxPayH5, WxPayQrCode) {

    sign.registerHttpHook({
      match: /^请求微信支付$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        return mockResponse(WxPayH5(param));
      }
    });
    sign.registerHttpHook({
      match: /^请求微信二维码支付$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        return mockResponse(WxPayQrCode(param));
      }
    });
  }]);


})(angular, window);