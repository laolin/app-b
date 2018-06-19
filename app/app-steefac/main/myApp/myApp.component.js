'use strict';

angular.module('steefac')
.component('myApp',{
  template: `
    <appb-ui-header header-data='appb.headerData' ng-if="!appb.headerData.hide && sj"></appb-ui-header>
    <div class="main-container flex-v flex-1" scroll-parent ng-if="sj">
      <div ng-view class="flex-v flex-1">
        <h5 class='text-center'>Loading...</h5>
      </div>
    </div>
    <appb-ui-footer class="{{SiteConfig.ver.name}}" footer-data='appb.footerData' ng-if="sj"></appb-ui-footer>

    <!-- 迟早要删除的，呵呵 -->
    <appb-ui-abc app-data='appb.appData' ng-if="sj"></appb-ui-abc>
  <div class="pc" ng-if="!sj">
    <h3>请在手机微信中打开</h3>
    <!-- <img src="http://qr.liantu.com/api.php?text={{url}}"> -->
  </div>`,
  bindings: {
  },
  controller:['$scope', '$element', 'AppbData', 'APP', function ($scope, $element, AppbData, APP) {
    $element.addClass("flex-v flex-1");
    var appb = $scope.appb = {
      appData    : AppbData.getAppData(),
      headerData : AppbData.getHeaderData(),
      footerData : AppbData.getFooterData(),
      dialogData : AppbData.getDialogData()
    };

    $scope.SiteConfig = APP.SiteConfig;

    appb.startPathMonitor=AppbData.startPathMonitor;
    //监控路由变化
    appb.startPathMonitor();

    $scope.url = encodeURI(location.href);
    $scope.sj = true;
    // 使用下面这一行代码，将简单关闭PC界面
    //$scope.sj = document.body.clientWidth < 768;
  }]
})
.filter('timespan', function() { //可以注入依赖
  return function(timespan, format) {
    var d = new Date();
    d.setTime(timespan * 1000);
    return timeFormat(d, format || "yyyy-MM-dd");
  }
})
.filter('substr', function() { //可以注入依赖
  return function(str, b, e) {
    return (str + "").substr(b, e);
  }
})
.filter('https', function() { //可以注入依赖
  return function(url) {
    if(url.substr(0, 5) == 'http:') return url.substr(5);
    return url;
  }
})
.filter('distance', function() { //可以注入依赖
  return function(distance) {
    distance = + distance;
    if(distance < 1000) return Math.round(distance) + " m";
    if(distance > 1e5) return Math.round(distance/1e3) + " km";
    distance = Math.round(distance/100) + "";
    return Math.floor(distance / 10) + '.' + distance%10 + ' km';
  }
});

/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
  可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
  Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
function timeFormat(t, fmt) {
  var o = {
    "M+" : t.getMonth()+1, //月份
    "d+" : t.getDate(), //日
    "h+" : t.getHours()%12 == 0 ? 12 : t.getHours()%12, //小时
    "H+" : t.getHours(), //小时
    "m+" : t.getMinutes(), //分
    "s+" : t.getSeconds(), //秒
    "q+" : Math.floor((t.getMonth()+3)/3), //季度
    "S" : t.getMilliseconds() //毫秒
  };
  var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (t.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[t.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

