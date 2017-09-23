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
    addrInput:{},
    
    selLocation:{},
    selName:'',
    selMarker:false,
    
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
      mapData.onLocateComplete=onLocateComplete;
      FacMap.loading=false;
      AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {
        FacMap.AwesomeMarker=AwesomeMarker;
        FacMap.selMarker=
          _newMarker('#fff','18px','header',appData.mapData.map.getCenter(),true,'可拖动定位');
        
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
  

  
  //给madData自动回调的
  function onClick(msg) {
    $log.log('--mapData.onClick--',msg);
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
    
    mapData.plugins.geocoder.getAddress(lnglat, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        result.regeocode.formattedAddress; //返回地址描述
        $log.log('--_selPosition Result->',result.regeocode.addressComponent);
        $timeout(function(){
          FacMap.selLocation=result.regeocode;
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
    obj.lnglat=obj.position;//高德的成员名字不统一。。。
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
  
  function newSearchMarkers(rs,first,len) {
    //selMarker已ready，说明可以安全地创建其他marker
    getSelMarker().then(function(){
      for(var i=0;i<FacMap.searchMarkers.length;i++) {
        FacMap.searchMarkers[i].setMap(null);
      }
      FacMap.searchMarkers=[];
      //_newMarker('#fff','18px','header',appData.mapData.map.getCenter(),true)
      for(var i=first,j=0;i<rs.length&&i<first+len;i++,j++) {
        FacMap.searchMarkers[j]=_newMarker('#fff','16px','road',[rs[i].lngE7/1E7,rs[i].latE7/1E7],false,(''+rs[i].name).substr(0,4));
        FacMap.searchMarkers[j].show();
        FacMap.searchMarkers[j].facObj=rs[i];
        FacMap.searchMarkers[j].facIndex=i;
        FacMap.searchMarkers[j].on('click', function(e){
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
  
  function hideInfoWindow(){
    getInfoWindow().then(function(iw){
      iw.close();
    });
  }
  function showInfoWindow(o) {
    getInfoWindow().then(function(iw){
      
      AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow)
      {

        FacMap.infoWindow = new SimpleInfoWindow({
          offset: new AMap.Pixel(0, -32)
        });

          
        FacMap.infoWindow.setInfoTitle('<strong><%- name %></strong>')

        //设置标题内容
        FacMap.infoWindow.setInfoBody(
        '剩余产能<%- cap_6m %>吨，厂房面积<%- area_factory %>㎡<br>'+
        '擅长构件：<%- goodat %><br/>'+
        '<%- update_at %>更新'+
        '<a href="#!/fac-detail?id=<%- id %>">【详情】</a><br/>'
        );

        //设置主体内容
        var dt=new Date(1000*o.update_at);
        var u_at=(dt.getYear()+1900)+'.'+(dt.getMonth()+1)+'.'+dt.getDate();
        FacMap.infoWindow.setInfoTplData({
          name:o.name,
          cap_6m:o.cap_6m,
          update_at:u_at,
          area_factory:o.area_factory,
          goodat:o.goodat,
          id:o.id
        });
        FacMap.infoWindow.open(mapData.map, [o.lngE7/1e7,o.latE7/1e7]);
      
      
        
      })
    });
  }  
  
  
  
  //===============
  appData.FacMap=FacMap;
  
  FacMap.searchAddr=searchAddr;
  FacMap.getSelMarker=getSelMarker;
  FacMap.showSelMarker=showSelMarker;
  
  FacMap.newSearchMarkers=newSearchMarkers;
  FacMap.showSearchMarkers=showSearchMarkers;
  
  FacMap.getInfoWindow=getInfoWindow;
  FacMap.showInfoWindow=showInfoWindow;
  FacMap.hideInfoWindow=hideInfoWindow;
  init();

  return  FacMap;
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
