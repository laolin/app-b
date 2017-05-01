'use strict';
(function(){

angular.module('live-community')
.factory('LivecData', ['$log','$timeout','$http','AppbData','AmapMainData',
function ($log,$timeout,$http,AppbData,AmapMainData){
  var svc=this;
  var appData=AppbData.getAppData();
  var mapData=AmapMainData.getMapData();

  var livecData={locationSel:{}};
  
  function onClick(msg) {
    $log.log('--mapData.onClick--',msg);
    livecData.lnglatSel=msg.lnglat;
    if(livecData.selMarker) {
      livecData.selMarker.setPosition(msg.lnglat);
    }
    
    
    
    
    mapData.plugins.geocoder.getAddress(msg.lnglat, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        result.regeocode.formattedAddress; //返回地址描述
        $log.log('--mapData.onClick Result->',result.regeocode);
        $timeout(function(){livecData.locationSel=result.regeocode;},1);
      }
    });     

  }
  
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
              color: '#029', //设置颜色
              fontSize: '18px' //设置字号
            }
          },
          iconStyle: 'beige', //设置图标样式

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
