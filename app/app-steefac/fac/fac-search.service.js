'use strict';
(function(){

//qgsMainApi

angular.module('steefac')
.factory('FacSearch',
['$location','$log','AppbData','AmapMainData','FacApi','FacMap','FacUser',
function($location,$log,AppbData,AmapMainData,FacApi,FacMap,FacUser) {
  
  var FacSearch={};
  var appData=AppbData.getAppData();
  var mapData=AmapMainData.getMapData();
  
  appData.FacSearch=FacSearch;

  FacSearch.showPageSize=5;//显示满一页多少个
  FacSearch.showPageNumber=-1;//当前显示第几页
  FacSearch.showCount=0;//实际显示出来多少个（由于最后一页可能不满页）
  
  FacSearch.result=0;
  FacSearch.resultSelected=-1;
  FacSearch.searching=0;
  FacSearch.resultTime=0;
  FacSearch.options={orderBy:'auto',searchInsideMap:0,countRes:1000};
  FacSearch.searchWord='';
  FacSearch.searchPlaceholder='输入名称/地址/...';
  FacSearch.searchList = []; //TODO: values will get from API

  FacSearch.clearSearchWord=function(){
    FacSearch.searchWord='';
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
          Math.max(
            (mapData.northeast.lat- mapData.southwest.lat),
            (mapData.northeast.lng- mapData.southwest.lng)
          )
        );
      }
      
    }
    $log.log('serchPara ', serchPara);
    return _doSearch(serchPara);
  }
  function _doSearch(serchPara){
    serchPara.count=FacSearch.options.countRes;
    FacSearch.searching=true;
    FacSearch.resultSelected=-1;
    
    return FacApi.callApi('steefac','search',serchPara).then(
      function(s){
        FacSearch.searching=false;
        FacSearch.resultTime= +new Date();//用来标记搜索结果是否更新
        $log.log('sreach-res--1',s);
        FacSearch.result=s;
        FacSearch.showSearchRes(FacSearch.showPageNumber=0);
      }
    );

    //$location.url('/search-result');  
  }
  FacSearch.showSearchRes=function (pn){
    
    var maxlat=-555e7;
    var maxlng=-555e7;
    var minlat=555e7;
    var minlng=555e7;

    FacSearch.showPageNumber=pn;
    var ps=FacSearch.showPageSize;
    
    var ln=FacSearch.result.length;
    var n=0;//for执行完n还是0的话，说明都没有正常的坐标。不执行map.setBounds
    for(var i=pn*ps;i<ln &&i<pn*ps+ps; i++ ) {
      var lng=FacSearch.result[i].lngE7;
      var lat=FacSearch.result[i].latE7;
      if(lng==0 && lat==0)continue;
      n++;
      maxlng=Math.max(maxlng,lng);
      minlng=Math.min(minlng,lng);
      maxlat=Math.max(maxlat,lat);
      minlat=Math.min(minlat,lat);
    }
    FacSearch.showCount=Math.min(ps,ln-pn*ps);
    $log.log('n=====',n);
    if(n&&mapData.map) {
      
      $log.log('Bounds',{lng:minlng,lat:minlat},{lng:maxlng,lat:maxlat});
      maxlng/=1e7;
      minlng/=1e7;
      maxlat/=1e7;
      minlat/=1e7;
      mapData.map.setBounds(new AMap.Bounds([minlng,minlat],[maxlng,maxlat]));
      
    }
    FacMap.newSearchMarkers(FacSearch.result,pn*ps,ps);

  }

  
  return  FacSearch;
  
}]);
 
  

})();