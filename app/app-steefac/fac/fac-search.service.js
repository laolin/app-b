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

  FacSearch.showPageSize=10;//显示满一页多少个
  FacSearch.showPageNumber=-1;//当前显示第几页
  FacSearch.showCount=0;//实际显示出来多少个（由于最后一页可能不满页）
  
  FacSearch.searchResult={};
  FacSearch.resultSelected=-1;//暂未使用
  FacSearch.searching=0;
  FacSearch.resultTime=0;//准备弃用
  
  FacSearch.options={orderBy:'auto',searchInsideMap:0,countRes:1000};
  FacSearch.searchWord='';
  FacSearch.searchPlaceholder='输入名称/地址/...';
  FacSearch.searchList = []; //TODO: values will get from API

  FacSearch.clearSearchWord=function(){
    FacSearch.searchWord='';
  }
  
  FacSearch.startSearch=function(type){
    if(type!='steefac'&&type!='steeproj'){
      $log.log('***err search type: ',type);
      return;
    }
    
  
    var bd;
    var serchPara={s:FacSearch.searchWord};

    if(mapData.map) {
      FacMap.hideInfoWindow()
      bd=mapData.map.getBounds( );
      mapData.northeast=bd.northeast;
      mapData.southwest=bd.southwest;
      if(FacSearch.options.searchInsideMap) {
        // ( * 1e7 / 2 ) => 5e6
        serchPara.lat=Math.floor(5e6*(mapData.southwest.lat + mapData.northeast.lat));
        serchPara.lng=Math.floor(5e6*(mapData.southwest.lng + mapData.northeast.lng));
        
        serchPara.dist= Math.floor(5e4*
          (
            (mapData.northeast.lat- mapData.southwest.lat)+
            (mapData.northeast.lng- mapData.southwest.lng)
          )/2
        );
      }
      
    }
    $log.log('serchPara ', serchPara);
    return _doSearch(serchPara,type);
  }
  function _doSearch(serchPara,type){
    serchPara.count=FacSearch.options.countRes;
    FacSearch.searching=true;
    FacSearch.resultSelected=-1;
    
    return FacApi.callApi(type,'search',serchPara).then(
      function(s){
        FacSearch.searching=false;
        FacSearch.searchResult[type+'.ver']= +new Date();//用来标记搜索结果是否更新
        $log.log('sreach-res--1',s);
        FacSearch.searchResult[type]=s;
        FacSearch.showSearchRes(type,FacSearch.showPageNumber=0);
      }
    );

    //$location.url('/search-result');  
  }
  FacSearch.showSearchRes=function (type,pn){
    FacMap.hideInfoWindow()
    
    var maxlat=-555e7;
    var maxlng=-555e7;
    var minlat=555e7;
    var minlng=555e7;

    FacSearch.showPageNumber=pn;
    var ps=FacSearch.showPageSize;
    
    var ln=FacSearch.searchResult[type].length;
    var n=0;//for执行完n还是0的话，说明都没有正常的坐标。不执行map.setBounds
    for(var i=pn*ps;i<ln &&i<pn*ps+ps; i++ ) {
      var lng=FacSearch.searchResult[type][i].lngE7;
      var lat=FacSearch.searchResult[type][i].latE7;
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
    FacMap.newSearchMarkers(FacSearch.searchResult[type],pn*ps,ps,FacSearch.infoOfObj,type);

  }
  FacSearch.clearResult=function (type){
    FacSearch.searchResult[type]=[];
    FacSearch.searchResult[type+'.ver']=0;
    FacSearch.resultSelected=-1;
    FacSearch.searching=0;
    FacMap.newSearchMarkers([],0,0,0,0);//清除地图中的标记
  }
  
  //从搜索结果 obj[j] 生成 infoWindow的数据
  FacSearch.infoOfObj=function(o,type) {
    var data={};
    if(type=='steefac'){
      data.infoTitle='<strong><%- name %></strong>';

      //设置标题内容
      data.infoBody=
      '剩余产能<%- cap_6m %>吨，厂房面积<%- area_factory %>㎡<br>'+
      '擅长构件：<%- goodat %><br/>'+
      '<%- update_at %>更新'+
      '<a href="#!/fac-detail?id=<%- id %>">【详情】</a><br/>'
      ;

      //设置主体内容
      var dt=new Date(1000*o.update_at);
      var u_at=(dt.getYear()+1900)+'.'+(dt.getMonth()+1)+'.'+dt.getDate();
      data.infoTplData={
        name:o.name,
        cap_6m:o.cap_6m,
        update_at:u_at,
        area_factory:o.area_factory,
        goodat:o.goodat,
        id:o.id
      };
    }
    if(type=='steeproj'){
      data.infoTitle='<strong><%- name %></strong>';

      //设置标题内容
      //，项目规模<%- size %>㎡
      data.infoBody=
      '用钢量<%- need_steel %>吨<br>'+
      '用钢时间：<%- in_month %><br/>'+
      '<%- update_at %>更新'+
      '<a href="#!/proj-detail?id=<%- id %>">【详情】</a><br/>'
      ;

      //设置主体内容
      var dt=new Date(1000*o.update_at);
      var u_at=(dt.getYear()+1900)+'.'+(dt.getMonth()+1)+'.'+dt.getDate();
      var omonth={3:'三月内',6:'六月内',12:'一年内',24:'两年内',60:'五年内'}
      data.infoTplData={
        name:o.name,
        need_steel:o.need_steel,
        size:o.size,
        update_at:u_at,
        in_month:omonth[o.in_month],
        id:o.id
      };
    }
    return data;
        
  }  
  
  //从搜索结果 obj[j] 生成 weui-cells的数据
  FacSearch.cellOfObj=function(obj,j,type) {
    if(type=='steeproj'){
      var omonth={3:'三月内',6:'六月内',12:'一年内',24:'两年内',60:'五年内'}
      return {
          text:''+obj[j].name+'，用钢量'+obj[j].need_steel+
          '吨，项目规模' +obj[j].size+ '㎡，用钢时间：'+omonth[obj[j].in_month],
          url:"/proj-detail?id="+obj[j].id,
          icon:'id-card'}
    }
    if(type=='steefac'){
      return {
          text:''+(j+1)+'.'+obj[j].name+'，剩余产能'+obj[j].cap_6m+
          '吨，擅长构件：'+obj[j].goodat,
          url:"/fac-detail?id="+obj[j].id,
          icon:'id-card'}
    }
    return {text:'err type:'+type,icon:'question'};

  }

  
  return  FacSearch;
  
}]);
 
  

})();