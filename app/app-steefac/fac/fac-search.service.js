'use strict';
(function(){

//qgsMainApi

angular.module('steefac')
.factory('FacSearch',
['$log','$timeout','AppbData','AmapMainData','FacApi','FacMap','FacUser',
function($log,$timeout,AppbData,AmapMainData,FacApi,FacMap,FacUser) {
  
  var FacSearch={};
  var appData=AppbData.getAppData();
  var mapData=AmapMainData.getMapData();
  
  appData.FacSearch=FacSearch;

  FacSearch.showPageSize=5;//显示满一页多少个
  FacSearch.showPageNumber={};//当前显示第几页
  FacSearch.showCount=0;//实际显示出来多少个（由于最后一页可能不满页）
  
  FacSearch.searchType='';
  FacSearch.searchResult={};
  FacSearch.searchResultSelected=-1;
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
      FacSearch.hideInfoWindow()
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
    FacSearch.searchResultSelected=-1;
    
    return FacApi.callApi(type,'search',serchPara).then(
      function(s){
        FacSearch.searching=false;
        FacSearch.searchResult[type+'.ver']= +new Date();//用来标记搜索结果是否更新
        $log.log('sreach-res--1',s);
        FacSearch.searchResult[type]=s;
        FacSearch.showSearchRes(type,FacSearch.showPageNumber[type]=0);
      }
    );

    //$location.url('/search-result');  
  }


  FacSearch.showSearchRes=function (type,pn){
    FacSearch.hideInfoWindow()
    
    FacSearch.searchType=type;
    FacSearch.showPageNumber[type]=pn;
    var ps=FacSearch.showPageSize;
    var ln=FacSearch.searchResult[type].length;
    
    FacSearch.showCount=Math.min(ps,ln-pn*ps);

    FacSearch.newSearchMarkers(FacSearch.searchResult[type],pn*ps,ps,FacSearch.infoOfObj,type);

  }
  FacSearch.clearResult=function (type){
    FacSearch.searchResult[type]=[];
    FacSearch.searchResult[type+'.ver']=0;
    FacSearch.searchResultSelected=-1;
    FacSearch.searching=0;
    FacSearch.newSearchMarkers([],0,0,0,type);//清除地图中的标记
  }






    
  FacSearch.newSearchMarkers=function(rs,first,len,infoOfObj,type) {
    
    var icons={steefac:'cubes',steeproj:'university'};
    //selMarker已ready，说明可以安全地创建其他marker
    FacMap.getSelMarker().then(function(){
      if(FacMap.searchMarkers[type])for(var i=0;i<FacMap.searchMarkers[type].length;i++) {
        FacMap.searchMarkers[type][i].setMap(null);
      }
      FacMap.searchMarkers[type]=[];

      var maxlat=-555e7;
      var maxlng=-555e7;
      var minlat=555e7;
      var minlng=555e7;
      var lng;
      var lat;

      for(var i=first,j=0;i<rs.length&&i<first+len;i++,j++) {
        lng=rs[i].lngE7;
        lat=rs[i].latE7;
        if(Math.abs(lng)>0.1 &&  Math.abs(lat)>0.1) {
          maxlng=Math.max(maxlng,lng);
          minlng=Math.min(minlng,lng);
          maxlat=Math.max(maxlat,lat);
          minlat=Math.min(minlat,lat);
        }
      
        FacMap.searchMarkers[type][j]=FacMap.newMarker('#fff','16px',icons[type],[lng/1E7,lat/1E7],false,(''+rs[i].name).substr(0,4));
        FacMap.searchMarkers[type][j].show();
        
        FacMap.searchMarkers[type][j].selIndex=i;
        FacMap.searchMarkers[type][j].on('click', function(e){
          FacSearch.selectOne(e.target.selIndex,type);
        });
      }
      maxlng/=1e7;
      minlng/=1e7;
      maxlat/=1e7;
      minlat/=1e7;
      
      //大约显示至 600米 范围
      if(Math.abs(minlng)>180)minlng=FacMap.selectedPosition.lng-0.003;
      if(Math.abs(minlat)>180)minlat=FacMap.selectedPosition.lat-0.003;
      if(Math.abs(maxlng)>180)maxlng=FacMap.selectedPosition.lng+0.003;
      if(Math.abs(maxlat)>180)maxlat=FacMap.selectedPosition.lat+0.003;

      FacMap.searchMarkersBounds[type]=new AMap.Bounds([minlng,minlat],[maxlng,maxlat]);
      mapData.map.setBounds(FacMap.searchMarkersBounds[type]);
      $log.log('FacMap.selectedPosition######2#',type,[minlng,minlat],[maxlng,maxlat]);
      
    })
  }




  FacSearch.showSearchMarkers=function(s,type) {
    FacSearch.searchType=type;
    if(FacMap.searchMarkers[type])for(var i=0;i<FacMap.searchMarkers[type].length;i++) {
      if(s)FacMap.searchMarkers[type][i].show();
      else FacMap.searchMarkers[type][i].hide();
    }
    if(s&&FacMap.searchMarkersBounds[type])
      mapData.map.setBounds(FacMap.searchMarkersBounds[type]);
  }

  FacSearch.selectOne=function(i,type) {
    FacSearch.showInfoWindow(i,type);
    $timeout(function(){
      FacSearch.searchResultSelected=i;
    },178);
    //178.2这里延时不能小于下面unselectOne，否则选中后，又马上被取消选中
    //另外这里延时绝对数不能太小，否则相当于没有延时，同上。
  }
  FacSearch.unselectOne=function(type) {
    FacSearch.searchResultSelected=-1;
    $timeout(function(){ 
    },178);//178.1这里延时不能太短，否则从一个选择换到另一个选择会有闪烁
  }


  
  FacSearch.hideInfoWindow=function(){
    FacMap.getInfoWindow().then(function(iw){
      iw.close();
    });
  }
  FacSearch.showInfoWindow=function(i,type) {
    FacMap.getInfoWindow().then(function(iw){
      var o=FacSearch.searchResult[type][i];
      var da=FacSearch.infoOfObj(o,type);

      AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow)
      {

        FacMap.infoWindow.close();
        FacMap.infoWindow = new SimpleInfoWindow({
          offset: new AMap.Pixel(0, -32)
        });

        FacMap.infoWindow.setInfoTitle(da.infoTitle);

        //设置标题内容
        FacMap.infoWindow.setInfoBody(da.infoBody);

        //设置主体内容
        FacMap.infoWindow.setInfoTplData(da.infoTplData);
        FacMap.infoWindow.open(mapData.map, [o.lngE7/1e7,o.latE7/1e7]);
      
        FacMap.infoWindow.on('close', function(e){
          FacSearch.unselectOne(type);
        })
      
        
      })
    });
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
          text:''+(j+1)+'.'+obj[j].name+'，用钢量'+obj[j].need_steel+
          '吨，项目规模' +obj[j].size+ '㎡，用钢时间：'+omonth[obj[j].in_month],
          url:function(){FacSearch.selectOne(j,type)},
          //url:"/proj-detail?id="+obj[j].id,
          icon:'id-card'}
    }
    if(type=='steefac'){
      return {
          text:''+(j+1)+'.'+obj[j].name+'，剩余产能'+obj[j].cap_6m+
          '吨，擅长构件：'+obj[j].goodat,
          url:function(){FacSearch.selectOne(j,type)},
          //url:"/fac-detail?id="+obj[j].id,
          icon:'id-card'}
    }
    return {text:'err type:'+type,icon:'question'};

  }
  //从搜索结果 obj[j] 生成 数字
  FacSearch.valueOfObj=function(obj,j,type) {
    if(type=='steeproj'){
      return {val:+obj[j].need_steel,name:'需求用钢',unit:'吨'};
    }
    if(type=='steefac'){
      return {val:+obj[j].cap_6m,name:'产能',unit:'吨'};
    }
    return {};
  }
  
  return  FacSearch;
  
}]);
 
  

})();