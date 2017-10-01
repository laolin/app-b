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
    myPosition:{},
    addrInput:{},
    
    selectedPosition:{},//LngLat对象
    selectedLocation:{},//解析后的地址信息对象
    selName:'',
    selMarker:false,
    
    searchMarkers:{},//搜索结果的AwesomeMarker
    searchMarkersBounds:{},//搜索结果的AwesomeMarker的范围边界
    
    creating:false
  };
  FacMap.newMarker=function(cssColor,cssSize,icon,position,draggable,text) {
    return new FacMap.AwesomeMarker({
      //设置awesomeIcon
      awesomeIcon: icon, //可用的icons参见： http://fontawesome.io/icons/
      //下列参数继承自父类
      visible: false,//可见
      draggable: draggable,
      //iconLabel中不能包含innerHTML属性（内部会利用awesomeIcon自动构建）
      iconLabel: {
        style: {
          color: cssColor, //设置颜色
          fontSize: cssSize //设置字号
        }
      },
      iconStyle: 'blue', //设置图标样式
      animation: "AMAP_ANIMATION_DROP",
      //title:'adfasfdafdsasdf',
      label:{content:text,offset:new AMap.Pixel(-12,-19)},

      //基础的Marker参数
      map: appData.mapData.map,
      position: position
    });
  }
  function _msg(m,tim) {
    $log.log(m)
    $timeout(function(){appData.toastMsg(m,tim)},78);
  }
  function init() {
    appData.mapData.ready(function(){
      mapData.onClick=onClick;

      FacMap.myPosition=appData.mapData.map.getCenter();
      FacMap.selectedPosition=appData.mapData.map.getCenter();
      mapData.onLocateComplete=onLocateComplete;
      FacMap.loading=false;

      AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {
        FacMap.AwesomeMarker=AwesomeMarker;
        FacMap.selMarker=
          FacMap.newMarker('#fff','18px','header',appData.mapData.map.getCenter(),true,'可拖动定位');
        FacMap.selectedPosition=appData.mapData.map.getCenter();
        
        //_selPosition(appData.mapData.map.getCenter());
        FacMap.selMarker.on('dragend',function(msg){
          _selPosition(FacMap.selMarker.getPosition());
        });
      });
      AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
        FacMap.infoWindow = new SimpleInfoWindow({
          infoTitle: '<strong>这里是标题</strong>',
          infoBody: '<p>这里是内容。</p>',
          offset: new AMap.Pixel(0, -32)
        });

        //显示在map上
        //infoWindow.open(map, map.getCenter());
      });

    })
  }
    
  //只在以下两个函数使用的变量：    
  var _pos_bak=false;
  function selPositionStart(icon,label,pos) {
    FacMap.getSelMarker().then(function(m){
      m.setAwesomeIcon(icon);
      m.show(1);
      
      if(pos && !_pos_bak){
        _pos_bak=m.getPosition();
      }
      if(pos){
        m.setPosition(pos);
      }
      else pos=m.getPosition();

      if(label)m.setLabel({content:label,offset:new AMap.Pixel(-12,-19)})
      else m.setLabel({content:'',offset:new AMap.Pixel(-12,-19)});

      FacMap.mapData.map.setZoomAndCenter(16,pos);
      FacMap.mapData.map.panBy(0,0);//不动一点点有时显示不出来 marker，不知为何
      
      FacMap.canClick=true;
      //angular.extend(addrInput_bak,FacMap.addrInput);
   });
  }
  function selPositionEnd() {

    FacMap.getSelMarker().then(function(m){
      m.hide();
      if(_pos_bak){
        m.setPosition(_pos_bak);
        _pos_bak=false;
      }
      //angular.extend(FacMap.addrInput,addrInput_bak);
      FacMap.canClick=false;
    })
  }
  
  //给madData自动回调的
  function onClick(msg) {
    if(!FacMap.canClick)return;
    _moveMarker(msg.lnglat);
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
    FacMap.selectedPosition=lnglat
    
    mapData.plugins.geocoder.getAddress(lnglat, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        result.regeocode.formattedAddress; //返回地址描述
        $log.log('--_selPosition Result->',result.regeocode.addressComponent);
        $timeout(function(){
          FacMap.selectedLocation=result.regeocode;
          FacMap.selName=result.regeocode.formattedAddress;
          
          
          
          var pos=result.regeocode;
          FacMap.addrInput.latE7=Math.round(1e7*lnglat.lat);
          FacMap.addrInput.lngE7=Math.round(1e7*lnglat.lng);
          FacMap.addrInput.province=pos.addressComponent.province;
          FacMap.addrInput.city=pos.addressComponent.city;
          FacMap.addrInput.district=pos.addressComponent.district;
          FacMap.addrInput.adcode=pos.addressComponent.adcode;
          FacMap.addrInput.citycode=pos.addressComponent.citycode;
          FacMap.addrInput.formatted_address=pos.formattedAddress;
          
        },1);
      }
    });

  }
  
  //给madData自动回调的
  function onLocateComplete(obj,a,b,c) {
    $log.log('LacCmp==',obj);
    FacMap.myPosition=obj.position;
    //_moveMarker(obj.lnglat);
    //_msg('已自动定位到您的位置',7);
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
        FacMap.addrInput.latE7=Math.round(1e7*pos.location.lat);
        FacMap.addrInput.lngE7=Math.round(1e7*pos.location.lng);
        FacMap.addrInput.province=pos.addressComponent.province;
        FacMap.addrInput.city=pos.addressComponent.city;
        FacMap.addrInput.district=pos.addressComponent.district;
        FacMap.addrInput.citycode=pos.addressComponent.citycode;
        FacMap.addrInput.adcode=pos.adcode;
        FacMap.addrInput.formatted_address=pos.formattedAddress;
        
      },78);
      
    });
  }
  
  //selMarker 是加载完成后插件后自动创建。
  //可以用来做标记，以安全地创建其他marker
  function getSelMarker() {
    getSelMarker.i++;
    $log.log('getSelMarker-',getSelMarker.i);
    var deferred = $q.defer();
    if(FacMap.selMarker){
      getSelMarker.i=0;
      deferred.resolve(FacMap.selMarker);
      return deferred.promise;
    }
    return $timeout(getSelMarker,278);
  }
  getSelMarker.i=0;

  function getInfoWindow() {
    getInfoWindow.i++;
    $log.log('getInfoWindow-',getInfoWindow.i);
    var deferred = $q.defer();
    if(FacMap.infoWindow){
      getInfoWindow.i=0;
      deferred.resolve(FacMap.infoWindow);
      return deferred.promise;
    }
    return $timeout(getInfoWindow,278);
  }
  getInfoWindow.i=0;
  
  
  function showSelMarker(s) {
    getSelMarker().then(function(){
      if(s)FacMap.selMarker.show();
      else FacMap.selMarker.hide();
    });
  }
  

  
  
  //===============
  appData.FacMap=FacMap;
  
  FacMap.selPositionStart=selPositionStart;
  FacMap.selPositionEnd=selPositionEnd;
  
  FacMap.searchAddr=searchAddr;
  FacMap.getSelMarker=getSelMarker;
  FacMap.showSelMarker=showSelMarker;
  

  
  FacMap.getInfoWindow=getInfoWindow;

  init();

  return  FacMap;
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
