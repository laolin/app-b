'use strict';
(function(){

angular.module('amap-main')
.factory('AmapMainData', ['$log','$timeout','$http','$q','AppbData',
function ($log,$timeout,$http,$q,AppbData){
  var svc=this;
  var amapDeferred = $q.defer();
  var onAmap = amapDeferred.promise;
  var mapData={
    options:{zoom: 15,isHotspot:1},
    plugins:{},
    locatedMark:0,//完成定位标记
    readyMarks:[0,0,0],
    isReady:0,//函数，在下面重定义，存在多个异步调用，判断全部readyMarks
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

    function waitMap() {
      waitMap.i++;
      $log.log('waitMap-',waitMap.i);
      var deferred = $q.defer();
      if('undefined'!=typeof AMap && 'undefined'!=typeof AMap.Geocoder){
        waitMap.i=0;
        deferred.resolve(1);
        return deferred.promise;
      }
      return $timeout(waitMap,278);
    }
    waitMap.i=0;

    function waitMapUI() {
      waitMapUI.i++;
      $log.log('waitMapUI-',waitMapUI.i);
      var deferred = $q.defer();
      if('undefined'!=typeof AMapUI && 'undefined'!=typeof AMapUI.loadUI){
        waitMapUI.i=0;
        deferred.resolve(1);
        return deferred.promise;
      }
      return $timeout(waitMapUI,278);
    }
    waitMapUI.i=0;


    loadMapScript();

    waitMap()
    .then(function(d1){
      _init_map();
      svc.showLocateButton();
    },function(e){$log.log('Error loadMapScript',e)})
    .then(function(d2){
      loadMapUiScript();
      waitMapUI().then(function(d3){
        mapData.readyMarks[0]=1;
        $log.log('mapData.readyMarks',mapData.readyMarks);
      },function(e){
        mapData.readyMarks[0]=2;//其实也是正确的
        $log.log('mapData.readyMarks',mapData.readyMarks);
      });
      //loadMapUiScript这里加载js文件正常，
      //但还是似乎是JS文件执行的结果有什么问题，
      //angular会收到404错误，不知道为什么 //TODO
    });

    //以下为initMap的内部函数
    function _init_map() {
      $log.log("Init AMap ...");
      if(mapData.map)return $q;
      mapData.div = document.createElement("div");
      mapData.div.id='map-contain-'+(+new Date());
      mapData.div.style.height="100%";
      mapData.div.style.width="100%";

      //目前不知道显示在哪，但 AMap.Map 要求在放在 body 内，所以隐藏后再加到 body 后
      mapData.div.style.display="none";
      document.body.appendChild(mapData.div);
      mapData.map = new AMap.Map(mapData.div.id, mapData.options);
      mapData.map.addControl(new AMap.ToolBar());
      _onMove();
      mapData.map.on('moveend',_onMove);
      mapData.map.on('zoomend',_onMove);
      mapData.map.on('resize',_onMove);
      mapData.map.on('click',_onClick);


      /**
       * 监听 amapDeferred
       */
      !(function(){
        amapDeferred.resolve(onAmap = mapData.map);
      })();

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

    function loadMapScript() {
      return $.getScript("https://webapi.amap.com/maps?v=1.3&key=b4a551eacfbb920a6e68b5eca1126dd5" +
      "&plugin=AMap.ToolBar,AMap.Geocoder,AMap.PlaceSearch,AMap.DistrictSearch");
      //,AMap.Autocomplete,AMap.Scale,AMap.OverView";
    }
    //$http.jsonp经常会 reject，改用jQuery加载地图js
    function loadMapUiScript() {
      return $.getScript("https://webapi.amap.com/ui/1.0/main.js");
    }
  }

  mapData.isReady=function() {
    // readyMarks[0] : map js is readyMarks
    // [1]: AMap.PlaceSearch is readyMarks
    // [2]: AMap.Geocoder is readyMarks
    for( var i=mapData.readyMarks.length;i--; ) {
      if(!mapData.readyMarks[i])return false;
    }
    return true;
  }

  function ready(callback) {
    //$log.log('mapData.onReady:',mapData.readyMarks.join(','));
    if(!mapData.isReady()) {
      return $timeout(function(){ready(callback)},800);
    }
    //$log.log('mapData.onReady run! ',mapData.readyMarks.join(','));
    $timeout(callback,1);
  }
  function _onMove(msg) {
    var bd=mapData.map.getBounds( );
    mapData.northeast=bd.northeast;
    mapData.southwest=bd.southwest;
    if('function'==typeof mapData.onMove)mapData.onMove(msg);
  }
  function _onClick(msg) {
    $log.log('_onClick',msg);
    if('function'==typeof mapData.onClick)mapData.onClick(msg);
  }
  function _onLocateComplete(msg) {
    $log.log('onLocateComplete');
    if('function'==typeof mapData.onLocateComplete)mapData.onLocateComplete(msg);
  }
  function _onLocateError(msg) {
    $log.log('onLocateError');
    if('function'==typeof mapData.onLocateError)mapData.onLocateError(msg);
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
        buttonOffset: new AMap.Pixel(50, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      mapData.map.addControl(svc.geolocation);
      AMap.event.addListener(svc.geolocation, 'complete', _onLocateComplete);//返回定位信息
      AMap.event.addListener(svc.geolocation, 'error', _onLocateError);
      //getCurrentPosition();//自动定位到当前位置
      mapData.plugins.geolocation=svc.geolocation;
    });
    mapData.map.plugin('AMap.Geocoder', function () {
      svc.geocoder = new AMap.Geocoder({});
      mapData.plugins.geocoder=svc.geocoder;
      mapData.readyMarks[2]=1;
    });
    mapData.map.plugin('AMap.PlaceSearch', function () {
      svc.placeSearch = new AMap.PlaceSearch({});
      mapData.plugins.placeSearch=svc.placeSearch;
      mapData.readyMarks[1]=1;
    });






  }
  function getCurrentPosition() {
    svc.geolocation.getCurrentPosition(function(status,res){
      mapData.resLocation=res;
      mapData.locatedMark=1;
      //appData.msgBox(res.formattedAddress+'\n经度：'+res.position.lng+'，纬度'+res.position.lat,'地址信息');
      //$timeout(function(){},1);//相当于$scope.$apply()

    });
  }

  mapData.showMapTo=showMapTo;
  mapData.setMapOptions=setMapOptions;
  mapData.getCurrentPosition=getCurrentPosition;

  mapData.ready=ready;

  //oNxxx(msg)用于设置回调函数
  //目前仅允许设一个回调函数，覆盖掉上次设置的。
  mapData.onMove=function(msg) { };
  mapData.onClick=function(msg) { };
  mapData.onLocateComplete=function(msg) { };
  mapData.onLocateError=function(msg) { };
  initMap();

  /**
   * 行政辖区接口
   */
  var china = (function(){
    var levelName = ['country', 'province', 'city', 'district', 'biz_area'];

    function getAllCity(){
      if(getAllCity.promise) return $q.when(getAllCity.promise);
      var deferred = $q.defer();
      getAllCity.promise = deferred.promise;
      $q.when(onAmap, (amap) => {
        var districtSearch = new AMap.DistrictSearch({
          level : 'country',
          subdistrict : 3
        });
        districtSearch.search('中国', function(status, result){
          //TODO : 按照自己需求处理查询结果
          deferred.resolve(getAllCity.promise = result.districtList[0].districtList)
        });
      });
      return getAllCity.promise;
    }
    /**
     * 在获取成功全国城市列表后，方可调用
     */
    function getSubCity(prevNames){
      let cityList = getAllCity.promise;
      prevNames = prevNames || [];
      if(typeof prevNames == 'string'){
        prevNames = prevNames ? prevNames.split(' ') : [];
      }
      for(let name of prevNames){
        if(!name) return [];
        cityList = cityList.find(subCity => {
          return subCity.name == name;
        });
        if(!cityList || !cityList.districtList) return [];
        cityList = cityList.districtList;
      }
      return cityList.map( city => city.name );
    }

    return {
      getSubCity: getSubCity,
      getAllCity: getAllCity
    }
  })();

  china.getAllCity().then(json=>{
    console.log('中华人民共和国,', json)
  });


  return {
    china: china,
    showMapTo:showMapTo,
    getMapData:function () {return mapData}
  };

}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



})();
