'use strict';
(function(){

angular.module('live-community')
.factory('LivecData', ['$log','$timeout','$http','AppbData','AmapMainData',
function ($log,$timeout,$http,AppbData,AmapMainData){
  var svc=this;
  var appData=AppbData.getAppData();
  var mapData=AmapMainData.getMapData();

  var livecData={
    selLocation:{},
    creating:false
  };
  
  function onClick(msg) {
    $log.log('--mapData.onClick--',msg);
    if(! livecData.selLnglat) { //第一次点击，弹出操作帮助提示
      appData.toastMsg('创建小区前可先改名',8);
    }
    livecData.selLnglat=msg.lnglat;
    if(livecData.selMarker) {
      livecData.selMarker.setPosition(msg.lnglat);
    }
    mapData.plugins.geocoder.getAddress(msg.lnglat, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        result.regeocode.formattedAddress; //返回地址描述
        $log.log('--mapData.onClick Result->',result.regeocode.addressComponent);
        $timeout(function(){
          livecData.selLocation=result.regeocode;
          livecData.selName=result.regeocode.formattedAddress;
        },1);
      }
    });     

  }
  
  function createLivec() {
    livecData.creating=true;
    var api=appData.urlSignApi('livecommunity','create');
    var adc=livecData.selLocation.addressComponent
    var params={
      name:livecData.selName,
      descript:livecData.selLocation.formattedAddress,
      addr:adc.district+adc.township+adc.street,
      lngE7:Math.round(livecData.selLnglat.lng*1e7),
      latE7:Math.round(livecData.selLnglat.lat*1e7),
      province:livecData.selLocation.addressComponent.province,
      city:livecData.selLocation.addressComponent.city,
      citycode:livecData.selLocation.addressComponent.citycode
    }
    $log.log('params=',params);
    $http.jsonp(api,{params:params})
    .then(function(s) {
      livecData.creating=false;
      if(s.data.errcode!=0) {
        appData.toastMsg(s.data.msg+'#'+s.data.errcode,7);
      }
    },function(e) {
      livecData.creating=false;
    });

  }
  
  //===============
  livecData.createLivec=createLivec;
  appData.livecData=livecData;
  
  init();
  function init() {
    appData.mapData.onReady(function(){
      mapData.onClick=onClick;
      
      AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {
        livecData.selMarker=new AwesomeMarker({
          //设置awesomeIcon
          awesomeIcon: 'home', //可用的icons参见： http://fontawesome.io/icons/
          //下列参数继承自父类
          //iconLabel中不能包含innerHTML属性（内部会利用awesomeIcon自动构建）
          iconLabel: {
            style: {
              color: '#fff', //设置颜色
              fontSize: '18px' //设置字号
            }
          },
          iconStyle: 'blue', //设置图标样式

          //基础的Marker参数
          map: appData.mapData.map,
          position: appData.mapData.map.getCenter()
        });
      });
    })
  }

  return {
    getLivecData:function () {return livecData}
  };
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
