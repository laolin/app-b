/* -------------------------------------------------------------------
 * 本函数调用微信支付
 * 调用后，API就在wx_pay表中写入一行数据，这行数据没有“确定支付成功时间”successrq 字段。
 * 支付成功，这行数据的 successrq 字段将是实际得到确定支付成功的时间。
 
    同时，将调用 class_user::notify_pay_success 函数
 
 * 支付失败，将调用 fn_return(0)
 * 支付成功，将调用 fn_return(1)
 
 * payorder参数:
   orderid: orderid
   fen: $scope.allmoney * 100
   paymodule:"pay-order"
 
 * ------------------------------------------------------------------- */
function WxQrocdePay(options){
  var self = this;
  self.options = options;
  self.qr2_url = "";
  self.pay_order = {};    //获取支付参数后，将赋值
  //获取支付二维码，模式二
  self.get_qr2_url = function(fn){
    if(self.qr2_url) return fn(self.qr2_url);
    API.post("/wxpay/getqrpay2url", options.payorder, {
      //如果有两个人一起扫描支付，怎么办？
      success: function(json){
        self.qr2_url = json.url2;
        self.pay_order = json.pay_order;    //获取支付参数后，将赋值
        fn(self.qr2_url);
      }
    });
  }


  //检查支付是否成功
  self.check_pay = function(fn_after_check){
    self.fn_after_check = fn_after_check;
    self.user_cancled = false; //是否已取消支付...
    self.timerId = false; //当时定时器（循环测试）
    loop_check();
  }

  //关闭二维码
  self.cancel_pay = function(){
    self.user_cancled = true; //即使返回成功，也不管了
    window.clearTimeout(self.timerId); //关闭循环测试
  }


  //循环测试，直到支付成功或用户取消支付
  function loop_check(){
    if(self.user_cancled) return self.fn_after_check(0);
    //未确认支付成功，再过1秒查一下
    self.timerId = window.setTimeout(function(){ check_pay(); }, 1000);
  }

  //要求向支付方验证是否已成功支付，未成功支付的，继续循环测试
  function check_pay(){
    API.post("/wxpay/checkpay", self.pay_order, {
      success: function(json){
        if(json.errcode == 0)return self.fn_after_check(1);
        if(self.user_cancled) return self.fn_after_check(0);
        //未确认支付成功，再过1秒查一下
        self.timerId = window.setTimeout(function(){ check_pay(loop_check); }, 1000);
      },
      error: function(htt,e){
        loop_check();
      }
    });
  }
}

function callpay(uid, recharge100, paymodule, fn_return){
  var user_cancled = false; //是否已取消支付...
  var has_payed = false;    //是否已支付成功
  var pay_order = {};    //获取支付参数后，将赋值
  get_param_then_pay();
  
  //获取支付参数后，进行支付
  function get_param_then_pay(){
    //alert("get_param_then_pay1");
    $.ajax({
      url:"api/wxpay/recharge",
      type:"POST",
      dataType: "json",
      data: {uid: uid, recharge100: recharge100, paymodule: paymodule},
      success: function(json){
        //alert(JSON.stringify(json));
        if(json.errcode == 0){
          pay_order = { openid: json.openid, orderid: json.orderid };
          //马上开始后台循环测试，基本可以避免用户在支付后，不按“完成”按钮，造成的未收到支付信息的情况。
          loop_check();
          
          //调用支付，可以在循环测试之后，因为测试要在1秒之后才开始。
          wx.chooseWXPay({
            timestamp: json.js.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: json.js.nonceStr, // 支付签名随机串，不长于 32 位
            package: json.js.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: json.js.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: json.js.paySign, // 支付签名/
            complete:function(res){
              //alert("invoke:" + JSON.stringify(res));
              if(res.err_msg != "get_brand_wcpay_request:ok"){
                user_cancled = true;//通知JS已取消支付，这将结束循环测试。
                fn_return(0); 
              }
            }
          });
        }
      }
      ,error: function(htt,e){
        //alert(JSON.stringify(htt));
        fn_return(0);
      }
    });
  }
  
  //循环测试，直到支付成功或用户取消支付
  var loop_check = function(){
    if(user_cancled){
      fn_return(0); 
      return;
    }
    //n_check ++;
    //$("#debug").html(n_check);
    //未确认支付成功，再过1秒查一下
    window.setTimeout(function(){ check_pay(loop_check); }, 1000);
  }

  //要求向支付方验证是否已成功支付，未成功支付的，继续循环测试
  function check_pay(){
    //    $("#debug2").append("<br>B");
    $.ajax({
      url:"api/wxpay/checkpay",
      type:"POST",
      dataType: "json",
      data: pay_order,
      success: function(json){
        if(json.errcode == 0)fn_return(1);
        else loop_check();
        //$("#debug2").append(JSON.stringify(json));
      },
      error: function(htt,e){
        loop_check();
        //$("#debug2").append(JSON.stringify(htt));
      }
    });
    //    $("#debug2").append(",E<br>");
  }
}


