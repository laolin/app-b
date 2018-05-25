function templateUrl(url){return "app/" + url ;}

if(typeof window.SITE == 'undefined'){
  window.SITE = {
    //网站主页
    root : window.location.href.substr(0, window.location.href.indexOf("/", 10)),
    API:{
      root: window.theSiteConfig.apiRoot_old || "../../../api-qgs/src/api-old"
    }
  }
}
var SETTINGS = {
  module: "service", 
  enmodule: "service",
  
  //微信分享设置：
  share:{
    title : "更专业的人做更专业的事",
    content : "土木领域 海量专家 资源与您共享! 搞不定，请高手!",
    imgUrl : "http://qinggaoshou.com/qgs/images/logo-128.png",
    lineLink : SITE.root + "/"
  },
  
  //页面底部菜单：待回答】【我的回答】【我的帐户】【知识库
  navmenu:[
    {"href": "userlist","text":"用户", "icon": "user" },
    {"href": "qa","text":"问答", "icon": "question-sign" },
    {"href": "expert","text":"专家库", "icon": "tower" },
    {"href": "user","text":"编导", "icon": "glass" }
  ],

  qa_easy: ["难度1(100积分)","难度2(200积分)","难度3(500积分)","难度4(1000积分)","难度5(2000积分)","难度6(5000积分)","快速抢答(2积分)"],
  qa_easy2n: {"难度1(100积分)":100,"难度2(200积分)":200,"难度3(500积分)":500,"难度4(1000积分)":1000,"难度5(2000积分)":2000,"难度6(5000积分)":5000,"快速抢答(2积分)":2},
  qa_timelimit: ["时效1小时","时效1天","时效1星期","时效1个月" ],
  qa_timelimit2n: {"时效1小时":0.1,"时效1天":1,"时效1星期":7,"时效1个月":30 },


  typetree : {
    "钢结构":{
      "设计":0, "优化":0, "深化":0, "材料":0, "工艺":0, "加工":0, "安装":0, "计量":0, "报价":0, "客户":0
    },

    "预应力":{
      "设计":0, "施工":0, "加固":0
    },

    "BIM":{
      "咨询":0, "案例":0, "建模":0
    },

    "建筑总承包":{
      "投标方案":0, "动画制作":0, "专项技术":0, "其它":0
    },

    "项目发展公司":{
      "投资建设":0, "总承包":0, "专业分包":0, "投资控制":0, "项目管理":0, "生态圈":0
    },

    "工业化建造":{
      "代表企业":0, "整合模式":0, "资源":0, "工程案例":0
    },

    "耗能支撑":{
      "设计":0, "施工":0, "方案":0, "报价":0, "资源":0
    }
  },
  getmajor: function(k1, k2){
    var arr = SETTINGS.typetree;
    if(k1){
      arr = arr[k1];
      if(k2){
        arr = arr[k2];
      }
    }
    var R = [];
    for(var k in arr) R.push(k);
    return R;
  }
};


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          placeholder                                 ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
/**
 * 该控件兼容IE9以下，专门针对IE9以下不支持placeholder属性所做
 * Author: quranjie
 * Date：2014-09-26
 */
function enablePlaceholder() {
  // 如果不支持placeholder，用jQuery来完成
  if(!isSupportPlaceholder()) {
    // 遍历所有input对象, 除了密码框
    $('input').not("input[type='password']").each(
      function() {
        var self = $(this);
        var val = self.attr("placeholder");
        input(self, val);
      }
    );

    /* 对password框的特殊处理
    * 1.创建一个text框
    * 2.获取焦点和失去焦点的时候切换
    */
    $('input[type="password"]').each(
      function() {
        var self = $(this);
        var val  = self.attr('placeholder');
        password(self, val);
        return;
      }
    );
  }
  // 判断浏览器是否支持placeholder属性
  function isSupportPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
  }

  // jQuery替换placeholder的处理
  function input(obj, val) {
    var $input = obj;
    var val = val;
    $input.val(val);
    $input.focus(function() {
      if ($input.val() == val) {
        $input.val("");
      }
    }).blur(function() {
      if ($input.val() == "") {
        $input.val(val);
      }
    });
  }
  // jQuery替换placeholder的处理
  function password(obj, val) {
    var $input = obj;
    var val = val;
    $input.val(val);
    $input.attr("type", "text");
    $input.focus(function() {
      $input.attr("type", "password");
      if ($input.val() == val) {
        $input.val("");
      }
    }).blur(function() {
      if ($input.val() == "") {
        $input.attr("type", "text");
        $input.val(val);
      }
    });
  }
};

