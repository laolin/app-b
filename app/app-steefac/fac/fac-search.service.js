'use strict';
(function(){

//qgsMainApi

angular.module('steefac')
.factory('FacSearch',
['$location','$log','AppbData','AmapMainData','FacApi',
function($location,$log,AppbData,AmapMainData,FacApi) {
  
  var FacSearch={};
  var appData=AppbData.getAppData();
  var mapData=AmapMainData.getMapData();
  
  appData.FacSearch=FacSearch;

  FacSearch.result=0;
  FacSearch.resultSelected=-1;
  FacSearch.searching=0;
  FacSearch.resultTime=0;
  FacSearch.options={orderBy:'auto',searchInsideMap:0,countRes:20};
  FacSearch.searchWord='';
  FacSearch.searchPlaceholder='输入名称/地址/...';
  FacSearch.searchList = []; //TODO: values will get from API

  FacSearch.clearSearchWord=function(){
    FacSearch.searchWord='';
  }
  
  //调用形式： ('118.5,31.1', 500)
  FacSearch.searchAroundSelected=function(lnglat,dist){
    dist=dist * 100;// 大约 1米=100
    var i=FacSearch.resultSelected;
    if(i<0 || i>=FacSearch.result.data.length)return;
    lnglat=lnglat.split(',');
    var serchPara={};//={s:FacSearch.searchWord};
    serchPara.latlng= //以下算法假定经纬度都不会因为+/-500米后出现无效度数。
      Math.floor( 1e7 * lnglat[1]-dist ) + ',' +
      Math.floor( 1e7 * lnglat[0]-dist  ) + ',' +
      Math.floor( 1e7 * lnglat[1]+dist  ) + ',' +
      Math.floor( 1e7 * lnglat[0]+dist  );
    _doSearch(serchPara);
  }
  
  FacSearch.selectResult=function(i) {
    if(FacSearch.resultSelected==i)i=-1;
    FacSearch.resultSelected=i;
    if(!mapData.infoWindow)return;
    if(i<0)return mapData.infoWindow.close();
    var lnglat=FacSearch.result.data[i].lnglat.split(',');
    mapData.infoWindow.setPosition(lnglat);
    
    mapData.infoWindow.setContent('['+(1+i)+']'+FacSearch.result.data[i].name);
    mapData.infoWindow.open(mapData.map);
  }
  FacSearch.startSearch=function(){
    var bd;
    var serchPara={s:FacSearch.searchWord};

    if(mapData.map) {
      mapData.infoWindow.close();
      bd=mapData.map.getBounds( );
      mapData.northeast=bd.northeast;
      mapData.southwest=bd.southwest;
      if(FacSearch.options.searchInsideMap) {
        // ( * 1e7 / 2 ) => 5e6
        serchPara.lat=Math.floor(5e6*(mapData.southwest.lat + mapData.northeast.lat));
        serchPara.lng=Math.floor(5e6*(mapData.southwest.lng + mapData.northeast.lng));
        
        serchPara.dist= Math.floor(5e4*
          Math.min(
            (mapData.northeast.lat- mapData.southwest.lat),
            (mapData.northeast.lng- mapData.southwest.lng)
          )
        );
      }
      
    }
    $log.log('serchPara ', serchPara);
    _doSearch(serchPara);
  }
  function _doSearch(serchPara){
    serchPara.count=FacSearch.options.countRes;
    FacSearch.searching=true;
    FacSearch.resultSelected=-1;
    
    FacApi.callApi('steefac','search',serchPara).then(
      function(s){
        FacSearch.searching=false;
        FacSearch.resultTime= +new Date();//用来标记搜索结果是否更新
        $log.log('sreach-res--1',s);
        FacSearch.result=s;
        var maxlat=-555e7;
        var maxlng=-555e7;
        var minlat=555e7;
        var minlng=555e7;

        var n=0;//for执行完n还是0的话，说明都没有正常的坐标。不执行map.setBounds
        for(var i=FacSearch.result.length; i-- ; ) {
          var lng=FacSearch.result[i].lngE7;
          var lat=FacSearch.result[i].latE7;
          if(lng==0 && lat==0)continue;
          n++;
          maxlng=Math.max(maxlng,lng);
          minlng=Math.min(minlng,lng);
          maxlat=Math.max(maxlat,lat);
          minlat=Math.min(minlat,lat);
        }
        if(n&&mapData.map) {
          $log.log('Bounds',{lng:minlng,lat:minlat},{lng:maxlng,lat:maxlat});
          maxlng/=1e7;
          minlng/=1e7;
          maxlat/=1e7;
          minlat/=1e7;
          mapData.map.setBounds(new AMap.Bounds([minlng,minlat],[maxlng,maxlat]))
        }
      }
    );

    //$location.url('/search-result');
  }

  
  return  FacSearch;
  
}]);
 
  

})();