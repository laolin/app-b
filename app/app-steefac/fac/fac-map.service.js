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
    selMarker:false,
    //selLnglat:false,
    
    searchMarkers:[],
    
    creating:false
  };
  function _newMarker(cssColor,cssSize,icon,position,draggable,text) {
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
      label:{content:text,offset:[0,0]},

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
      mapData.onLocateComplete=onLocateComplete;
      FacMap.loading=false;
      AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {
        FacMap.AwesomeMarker=AwesomeMarker;
        FacMap.selMarker=
          _newMarker('#fff','18px','header',appData.mapData.map.getCenter(),true,'可拖动定位');
        
        _selPosition(appData.mapData.map.getCenter());
        FacMap.selMarker.on('dragend',function(msg){
          _selPosition(FacMap.selMarker.getPosition());
        });
      });
      AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
        FacMap.infoWindow = new SimpleInfoWindow({
          infoTitle: '<strong>这里是标题</strong>',
          infoBody: '<p>这里是内容。</p>'
        });

        //显示在map上
        //infoWindow.open(map, map.getCenter());
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
  
  //selMarker 是加载完成后插件后自动创建。
  //可以用来做标记，以安全地创建其他marker
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

  function _getInfoWindow() {
    _getInfoWindow.i++;
    $log.log('_getInfoWindow-',_getInfoWindow.i);
    var deferred = $q.defer();
    if(FacMap.infoWindow){
      _getInfoWindow.i=0;
      deferred.resolve(FacMap.infoWindow);
      return deferred.promise;
    }
    return $timeout(_getInfoWindow,278);
  }
  _getInfoWindow.i=0;
  
  
  function showSelMarker(s) {
    _getSelMarker().then(function(){
      if(s)FacMap.selMarker.show();
      else FacMap.selMarker.hide();
    });
  }
  
  function newSearchMarkers(rs) {
    //selMarker已ready，说明可以安全地创建其他marker
    _getSelMarker().then(function(){
      for(var i=0;i<FacMap.searchMarkers.length;i++) {
        FacMap.searchMarkers[i].setMap(null);
      }
      FacMap.searchMarkers=[];
      //_newMarker('#fff','18px','header',appData.mapData.map.getCenter(),true)
      for(var i=0;i<rs.length;i++) {
        FacMap.searchMarkers[i]=_newMarker('#fff','16px','road',[rs[i].lngE7/1E7,rs[i].latE7/1E7],false,(''+rs[i].name).substr(0,4));
        FacMap.searchMarkers[i].show();
        FacMap.searchMarkers[i].facObj=rs[i];
        FacMap.searchMarkers[i].facIndex=i;
        FacMap.searchMarkers[i].on('click', function(e){
          showInfoWindow(e.target.facObj);
        });
      }
      
    })
  }
  function showSearchMarkers(s) {
    for(var i=0;i<FacMap.searchMarkers.length;i++) {
      if(s)FacMap.searchMarkers[i].show();
      else FacMap.searchMarkers[i].hide();
    }
  }
  
  function showInfoWindow(o) {
    _getInfoWindow().then(function(iw){
      iw.setInfoTitle('<%- name %>')

      //设置标题内容
      iw.setInfoBody('<%- level %>级，年产能<%- cap_y %>吨<br>工人<%- workers %>名，工厂面积<%- area_factory %>㎡<br>擅长<%- goodat %>')
      //iw.setInfoBody('<%- level %>级<br>年产能<%- cap_y %>吨<br>擅长<%- goodat %>')

      //设置主体内容
      iw.setInfoTplData({
        name:o.name,
        level:['特','一','二','三'][o.level],
        cap_y:o.cap_y,
        workers:o.workers,
        area_factory:o.area_factory,
        goodat:o.goodat
      });
      iw.open(mapData.map, [o.lngE7/1e7,o.latE7/1e7]);
    });
  }  
  
  
  
  //===============
  appData.FacMap=FacMap;
  
  FacMap.searchAddr=searchAddr;
  FacMap.showSelMarker=showSelMarker;
  FacMap.newSearchMarkers=newSearchMarkers;
  FacMap.showSearchMarkers=showSearchMarkers;
  FacMap.showInfoWindow=showInfoWindow;
  init();

  return  FacMap;
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
