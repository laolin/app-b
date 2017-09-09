'use strict';
(function(){

angular.module('steefac')
.factory('FacMap', ['$log','$timeout','$q','AppbData','AmapMainData',
function ($log,$timeout,$q,AppbData,AmapMainData){
  var svc=this;
  var appData=AppbData.getAppData();
  var mapData=AmapMainData.getMapData();

  var FacMap={
    loading:true,
    mapData:mapData,
    facAddr:{},
    
    selLocation:{},
    selName:'',
    //selLnglat:false,
    
    creating:false
  };
  function _msg(m,tim) {
    $log.log(m)
    $timeout(function(){appData.toastMsg(m,tim)},78);
  }
  function init() {
    appData.mapData.ready(function(){
      mapData.onClick=onClick;
      mapData.onLocateComplete=onLocateComplete;
      FacMap.loading=false;
      AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {
        FacMap.selMarker=new AwesomeMarker({
          //设置awesomeIcon
          awesomeIcon: 'header', //可用的icons参见： http://fontawesome.io/icons/
          //下列参数继承自父类
          visible: false,//可见
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
        FacMap.selMarker.on('dragend',function(msg){
          _selPosition(FacMap.selMarker.getPosition());
        });
      });
    })
  }
  

  
  //给madData自动回调的
  function onClick(msg) {
    $log.log('--mapData.onClick--',msg);
    _moveMarker(msg.lnglat)
    _selPosition(msg.lnglat);
  }
  function _moveMarker(lnglat) {
    if(FacMap.selMarker) {
      //FacMap.selMarker.show();
      var dist=lnglat.distance(FacMap.selMarker.getPosition());//米
      var speed=dist*9;//此速度需要的时间 3.6/9=0.4秒。
      FacMap.selMarker.moveTo(lnglat,speed);//setPosition
    }
  }  
  
  function _selPosition(lnglat) {
    FacMap.selLnglat=lnglat;
    
    mapData.plugins.geocoder.getAddress(lnglat, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        result.regeocode.formattedAddress; //返回地址描述
        $log.log('--_selPosition Result->',result.regeocode.addressComponent);
        $timeout(function(){
          FacMap.selLocation=result.regeocode;
          FacMap.selName=result.regeocode.formattedAddress;
          
          
          
          var pos=result.regeocode;
          FacMap.facAddr.latE7=Math.round(1e7*lnglat.lat);
          FacMap.facAddr.lngE7=Math.round(1e7*lnglat.lng);
          FacMap.facAddr.province=pos.addressComponent.province;
          FacMap.facAddr.city=pos.addressComponent.city;
          FacMap.facAddr.district=pos.addressComponent.district;
          FacMap.facAddr.adcode=pos.addressComponent.adcode;
          FacMap.facAddr.citycode=pos.addressComponent.citycode;
          FacMap.facAddr.formatted_address=pos.formattedAddress;
          
        },1);
      }
    });

  }
  
  //给madData自动回调的
  function onLocateComplete(obj,a,b,c) {
    $log.log('LacCmp==',obj);
    obj.lnglat=obj.position;//高德的成员名字不统一。。。
    _moveMarker(obj.lnglat);
    _msg('已自动定位到您的位置',7);
  }
  //===================================================
  function searchAddr(addr) {
    FacMap.loading=true;
    mapData.plugins.geocoder.getLocation(addr, function (stat,res) {
      FacMap.loading=false;
      if(stat !== 'complete' || res.info !== 'OK') {
        _msg('Err: '+stat);
        return;
      }
      if(res.geocodes.length<1) {
        _msg('NothingFound');
        return;
      }
      $log.log('bn-',res.geocodes[0]);
      var pos=res.geocodes[0];
      mapData.map.setZoomAndCenter(16,pos.location);
      FacMap.selMarker.setPosition(pos.location);
      
      //不要用这一句，重复调用一下反解析，约浪费了1K流量
      //_selPosition(pos.location);
      
      $timeout(function(){
        FacMap.facAddr.latE7=Math.round(1e7*pos.location.lat);
        FacMap.facAddr.lngE7=Math.round(1e7*pos.location.lng);
        FacMap.facAddr.province=pos.addressComponent.province;
        FacMap.facAddr.city=pos.addressComponent.city;
        FacMap.facAddr.district=pos.addressComponent.district;
        FacMap.facAddr.citycode=pos.addressComponent.citycode;
        FacMap.facAddr.adcode=pos.adcode;
        FacMap.facAddr.formatted_address=pos.formattedAddress;
        
      },78);
      
    });
  }
  
  function _getSelMarker() {
    _getSelMarker.i++;
    $log.log('_getSelMarker-',_getSelMarker.i);
    var deferred = $q.defer();
    if(FacMap.selMarker){
      _getSelMarker.i=0;
      deferred.resolve(FacMap.selMarker);
      return deferred.promise;
    }
    return $timeout(_getSelMarker,278);
  }
  _getSelMarker.i=0;
  
  
  function showSelMarker(s) {
    _getSelMarker().then(function(){
      if(s)FacMap.selMarker.show();
      else FacMap.selMarker.hide();
    });
  }
  
  //===============
  appData.FacMap=FacMap;
  
  FacMap.searchAddr=searchAddr;
  FacMap.showSelMarker=showSelMarker;
  init();

  return  FacMap;
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
