'use strict';
(function(){

angular.module('live-community')
.factory('LivecData', ['$log','$timeout','$http','AppbData','AppbDataUser','AmapMainData',
function ($log,$timeout,$http,AppbData,AppbDataUser,AmapMainData){
  var svc=this;
  var appData=AppbData.getAppData();
  var userData=AppbDataUser.getUserData();
  var mapData=AmapMainData.getMapData();

  var livecData={
    selLocation:{},
    creating:false
  };
  
  function init() {
    appData.mapData.ready(function(){
      mapData.onClick=onClick;
      mapData.onLocateComplete=onLocateComplete;
      AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {
        livecData.selMarker=new AwesomeMarker({
          //设置awesomeIcon
          awesomeIcon: 'home', //可用的icons参见： http://fontawesome.io/icons/
          //下列参数继承自父类
          visible: true,//可见
          draggable: true,
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
        _selPosition(appData.mapData.map.getCenter());
        livecData.selMarker.on('dragend',function(msg){
          _selPosition(msg.lnglat);
        });
      });
    })
  }

  
  function onClick(msg) {
    //$log.log('--mapData.onClick--',msg);
    if(livecData.selMarker) {
      //livecData.selMarker.show();
      var dist=msg.lnglat.distance(livecData.selMarker.getPosition());//米
      var speed=dist*9;//此速度需要的时间 3.6/9=0.4秒。
      livecData.selMarker.moveTo(msg.lnglat,speed);//setPosition
    }
    _selPosition(msg.lnglat);
  }
  
  function _selPosition(lnglat) {
    if(! livecData.selLnglat) { //第一次点击，弹出操作帮助提示
      appData.toastMsg('创建小区前可先改名',8);
    }
    livecData.selLnglat=lnglat;
    mapData.plugins.geocoder.getAddress(lnglat, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        result.regeocode.formattedAddress; //返回地址描述
        //$log.log('--mapData.onClick Result->',result.regeocode.addressComponent);
        $timeout(function(){
          livecData.selLocation=result.regeocode;
          livecData.selName=result.regeocode.formattedAddress;
        },1);
      }
    });

  }
  
  function onLocateComplete(msg,a,b,c) {
    msg.lnglat=msg.position;//高德的成员名字不统一。。。
    onClick(msg);
    appData.toastMsg('已自动定位到您的位置',7);
  }
  //===================================================
  
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

  return {
    getLivecData:function () {return livecData}
  };
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
