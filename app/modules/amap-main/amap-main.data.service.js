'use strict';
(function(){

angular.module('amap-main')
.factory('AmapMainData', ['$log','$timeout','AppbData',
function ($log,$timeout,AppbData){
  var svc=this;
  var mapData={
    options:{zoom: 15},
    inInit:0 //表示是否正在初始化
  };
  var appData=AppbData.getAppData();
  appData.mapData=mapData;
  
  
  
  
  function setMapOptions(o){
    angular.extent(mapData.options,o); 
  }
  
  // showMap
  function showMapTo(ele,options) {
    if(typeof(options)=='object')setMapOptions(options);
    if(typeof(mapData.map)=='undefined')initMap(options);
    $timeout(wait_show_map, 1);
    
    function wait_show_map() {
      if(typeof (mapData.map) == 'undefined') {
        $timeout(wait_show_map, 100);
      } else {
        
        //如果已显示在别的地方，就先从别的地方删掉
        if(mapData.div.parentNode) {
          mapData.div.parentNode.removeChild(mapData.div);
        }

        if(!ele){ 
          $log.log('* showMapTo Error element',ele);
        } else {
          ele.innerHTML='';
          //地图放在指定的地方
          ele.appendChild(mapData.div);
        }
      }
    }
  }
  
  // initMap
  function initMap(options) {
    if(mapData.inInit)return;
    $log.log("Loading AMap ...",mapData.inInit);
    mapData.inInit=1;
    
    if(typeof(options)=='object')setMapOptions(options);
    if(typeof (AMap) == 'undefined')loadMapScript()
    $timeout(wait_init_map, 10);
    
    function wait_init_map() {
      if(mapData.inInit++ > 20 ) {
        //TODO
        //load map error, check network please.
      }
      $log.log("wait_init_map ...",mapData.inInit);
      if(typeof (AMap) == 'undefined' 
          || typeof (AMap.ToolBar) == 'undefined'
         // || typeof (AMap.Geocoder) == 'undefined'
          || typeof (AMap.Map) == 'undefined'
          ) {
        $timeout(wait_init_map, mapData.inInit * mapData.inInit * 100);
      }
      else {
        _init_map();
        //mapData.inInit=false;
        
        svc.showLocateButton();
      }
    }
    //initMap 直接执行的语句结束
    
    //以下为initMap的内部函数
    function _init_map() {
      $log.log("Init AMap ...");
      if(mapData.map)return;
      mapData.div = document.createElement("div");
      mapData.div.id='map-contain-'+(+new Date());
      mapData.div.style.height="100%";
      mapData.div.style.width="100%";
      
      //目前不知道显示在哪，但 AMap.Map 要求在放在 body 内，所以隐藏后再加到 body 后
      mapData.div.style.display="none";
      document.body.appendChild(mapData.div);
      mapData.map = new AMap.Map(mapData.div.id, mapData.options);
      mapData.map.addControl(new AMap.ToolBar());
      _saveMapBounds();
      mapData.map.on('moveend',_saveMapBounds);
      mapData.map.on('zoomend',_saveMapBounds);
      mapData.map.on('resize',_saveMapBounds);
      
      //初始化地图后，再从 body 中移走
      mapData.div.parentNode.removeChild(mapData.div);
      mapData.div.style.display='';
      
      mapData.infoWindow = new AMap.InfoWindow({
        content:'',
        offset:{x:0,y:-20},
        //position:,
        showShadow:true,
        autoMove:true
      });
      
    }
    function _saveMapBounds(msg) {
      $log.log('_saveMapBounds',msg);
      var bd=mapData.map.getBounds( );
      mapData.northeast=bd.northeast;
      mapData.southwest=bd.southwest;
    }
    function loadMapScript() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = location.protocol + 
      "//webapi.amap.com/maps?v=1.3&key=b4a551eacfbb920a6e68b5eca1126dd5" +
      "&plugin=AMap.ToolBar";
      //,AMap.Autocomplete,AMap.PlaceSearch,AMap.Geocoder,AMap.Scale,AMap.OverView";
      document.body.appendChild(script);
    }
  }
  
  svc.onLocateComplete = function() {
    $log.log('onLocateComplete');
  }
  svc.onLocateError = function() {
    $log.log('onLocateError');
  }
  
  svc.showLocateButton = function() {
    mapData.map.plugin('AMap.Geolocation', function () {
      svc.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      mapData.map.addControl(svc.geolocation);
      AMap.event.addListener(svc.geolocation, 'complete', svc.onLocateComplete);//返回定位信息
      AMap.event.addListener(svc.geolocation, 'error', svc.onLocateError);  
      
    })
  }
  function getCurrentPosition() {
    svc.geolocation.getCurrentPosition();
  }
  
  mapData.showMapTo=showMapTo;
  mapData.setMapOptions=setMapOptions;
  mapData.getCurrentPosition=getCurrentPosition;
  initMap();

  return {
    showMapTo:showMapTo,
    getMapData:function () {return mapData}
  };
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
