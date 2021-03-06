'use strict';
(function(){

//一些常量定义

var PAGE_SIZE = 5;
var SEARCH_SIZE = 50;
var SEARCH_SIZE_SYSADMIN = 5000;
    


angular.module('steefac')
.factory('FacSearch',
['$log','$timeout','$q','$location','AppbData','AmapMainData','SIGN','FacMap','FacUser','FacDefine','ProjDefine',
function($log,$timeout,$q,$location,AppbData,AmapMainData,SIGN,FacMap,FacUser,FacDefine,ProjDefine) {
  
  var FacSearch={};
  var appData=AppbData.getAppData();
  var mapData=AmapMainData.getMapData();
  
  appData.FacSearch=FacSearch;

  FacSearch.showPageSize=PAGE_SIZE;//显示满一页多少个
  FacSearch.showPageNumber={};//当前显示第几页
  FacSearch.showCount=0;//实际显示出来多少个（由于最后一页可能不满页）
  
  var objTypes=[
    'steefac','steeproj',
  ];
  var objNames={steefac:'钢构厂',steeproj:'项目信息'};
  var objIcons={steefac:'cubes',steeproj:'university'};
  var objDefines={steefac:FacDefine,steeproj:ProjDefine};


  FacSearch.objTypes=objTypes;
  FacSearch.objNames=objNames;
  FacSearch.objIcons=objIcons;
  FacSearch.objDefines=objDefines;
  
  FacSearch.isTypeValid=function(type) {
    return objTypes.indexOf(type)>=0;
  }
  
  FacSearch.searchType=objTypes[0];
  FacSearch.searchResult={};
  FacSearch.searchResultSelected=-1;
  FacSearch.searching=0;
  FacSearch.resultTime=0;//准备弃用
  
  FacSearch.datailCache={};//数据详情缓存
  
  //注，服务器已限制countRes不大于50
  FacSearch.options={orderBy:'auto',searchInsideMap:0,countRes:SEARCH_SIZE};
  FacSearch.searchWord='';
  FacSearch.searchPlaceholder='输入名称/地址/...';
  FacSearch.searchList = []; //TODO: values will get from API

  FacSearch.options.distSelect = 0;
  FacSearch.distText=['50公里','100公里','200公里','300公里','500公里','不限距离'];
  FacSearch.distValue=[45,90,180,270,450,99999];
  //在中国所处的纬度水平，经、纬1度均近似100公里，以下均按此假定判断距离。
  //^^这里：由于搜索结果是按正方形搜索，不是圆形，故把正方形稍缩小

  FacSearch.levelDick = ['特级','一级','二级','三级','未定义'];

  FacSearch.clearSearchWord=function(){
    FacSearch.searchWord='';
  }

  /**
   * 再写一个新的搜索函数
   * 1. 不污染其它数据
   * 2. 不依赖原搜索
   * 3. 不依赖地图
   */
  FacSearch.search = function(param, type){
    if(!FacSearch.isTypeValid(type)){
      return $q.reject('**err search type:' + type);
    }

    /**
     * 根据城市名称搜索 ( 转换为经纬度后，递归 )
     *
     * 在执行搜索时，如果有经纬度，就不管城市而按该位置查询
     * 如果只有城市，没有经纬度，就按城市搜索
     */
    if(param.currentCity && (!param.lat || ! param.lng)){
      return AmapMainData.china.getCity(param.currentCity).then(
        city => {
          //console.log('城市？', city);
          return FacSearch.search(angular.extend(param, {lng: city.center.lng, lat: city.center.lat}), type)
        },
        (e) => {
          //console.log('无效的城市？', e);
          // 无效的城市？
          return FacSearch.search(angular.extend(param, {currentCity: ''}), type);
        }
      );
    }

    /* 固定参数 */
    var serchPara = {
      count  : FacSearch.options.countRes,
      type   : type,
      orderBy: param.orderBy,
      lat    : Math.floor(1e7 * param.lat), // 为什么不直接传递？( (''+lat).substr(0, 11) )
      lng    : Math.floor(1e7 * param.lng),
      dist   : Math.floor(1e3*FacSearch.distValue[param.distSelect || 0]),
    };
    /* 可选参数 */
    if(param.searchWord) serchPara.s         = param.searchWord;
    if(param.level     ) serchPara.level     = param.level     ;
    if(param.monthFrom ) serchPara.monthFrom = param.monthFrom ;
    if(param.monthTo   ) serchPara.monthTo   = param.monthTo   ;

    /* 开始搜索 */
    return SIGN.post('stee_data', 'search', serchPara)
    .then(json => json.datas.list)
    .then(list => {
      /**
       * 计算点到最后搜索基点的距离
       */
      var serchPos = new AMap.LngLat(param.lng, param.lat);
      list.map( item => {
        item.distance = serchPos.distance([item.lngE7/1e7, item.latE7/1e7]);
        item.totleAction = 0;
        if(item.action){
          for(var i in item.action){
            item.totleAction += item.action[i] && (+ item.action[i]) || 0;
          }
        }
      });
      //console.log('serchPara = ', serchPara);
      //console.log('serchPos = ', serchPos);
      return {list, pos: serchPos};
    });
  }
  
  FacSearch.startSearch=function(type, dontReLocation){
    if(!FacSearch.isTypeValid(type)){
      return $q.reject('**err search type:' + type);
    }

    /**
     * 根据城市名称搜索
     *
     * 在执行搜索时，如果有经纬度，就不管城市而按该位置查询
     * 如果只有城市，没有经纬度，就按城市搜索
     */
    if(FacSearch.options.currentCity && (!FacSearch.options.lat || ! FacSearch.options.lng)){
      return AmapMainData.china.getCity(FacSearch.options.currentCity).then(
        city => {
          FacSearch.options.lat = city.center.lat;
          FacSearch.options.lng = city.center.lng;
          return FacSearch.startSearch(type, dontReLocation).then( res => {
            FacSearch.options.lat = FacSearch.options.lng = false;
            return res;
          });
        },
        (e) => {
          console.log('无效的城市？', e);
          // 无效的城市？
          FacSearch.options.currentCity = '';
          return FacSearch.startSearch(type, dontReLocation);
        }
      );
    }
    
    var bd;
    var serchPara={
      s: FacSearch.searchWord || FacSearch.options.searchWord,
      orderBy: FacSearch.options.orderBy,
      dist   : Math.floor(1e3*FacSearch.distValue[FacSearch.options.distSelect]),
    };
    if(FacSearch.options.lat && FacSearch.options.lng){
      serchPara.lat = Math.floor(1e7 * FacSearch.options.lat);
      serchPara.lng = Math.floor(1e7 * FacSearch.options.lng);
      serchPara.dist= Math.floor(1e3*FacSearch.distValue[FacSearch.options.distSelect||0]);
    }
    else if(mapData.map) {
      FacSearch.hideInfoWindow()
      bd=mapData.map.getBounds( );
      mapData.northeast=bd.northeast;
      mapData.southwest=bd.southwest;
      
      if(FacSearch.options.searchInsideMap&&FacSearch.searchResultSelected<0) {
        // ( * 1e7 / 2 ) => 5e6
        serchPara.lat=Math.floor(5e6*(mapData.southwest.lat + mapData.northeast.lat));
        serchPara.lng=Math.floor(5e6*(mapData.southwest.lng + mapData.northeast.lng));
        
        serchPara.dist= Math.floor(5e4*
          (
            (mapData.northeast.lat- mapData.southwest.lat)+
            (mapData.northeast.lng- mapData.southwest.lng)
          )/2
        );
      } else {
        if(FacSearch.searchResultSelected>=0) {
          //从选中的搜索结果的周边搜索
          var sel=FacSearch.searchResult[FacSearch.searchType][FacSearch.searchResultSelected];
          serchPara.lat=sel.latE7;
          serchPara.lng=sel.lngE7;
          FacMap.selectedPosition=new AMap.LngLat(sel.lngE7/1e7,sel.latE7/1e7);
          FacMap.selMarker.setPosition(FacMap.selectedPosition);
        } else {
          //从地图选点的周边搜索
          var pos =FacMap.selectedPosition;          
          serchPara.lat=Math.floor(1e7*pos.lat);
          serchPara.lng=Math.floor(1e7*pos.lng); 
        }
        
        
        //客户端单位是1km，服务器规定的单位是1m
        serchPara.dist=Math.floor(1e3*FacSearch.distValue[FacSearch.options.distSelect]);
      }
      
    }
    serchPara.count=FacSearch.options.countRes;
    if(FacUser.isSysAdmin())serchPara.count=SEARCH_SIZE_SYSADMIN;
    return FacSearch.doSearch(serchPara,type, dontReLocation)
    .then(list => {
      /**
       * 计算点到最后搜索基点的距离
       */
      var serchPos = new AMap.LngLat(serchPara.lng/1e7, serchPara.lat/1e7);
      list.map( item => {
        item.distance = serchPos.distance([item.lngE7/1e7, item.latE7/1e7]);
      });
      return list;
    });
  }

  FacSearch.doSearch=function(serchPara,type, dontReLocation){
    FacSearch.searching=true;
    //FacSearch.searchResultSelected=-1;
    serchPara.type=type;
    return SIGN.postLaolin('steeobj','search',serchPara).then(
      function(s){
        FacSearch.searching=false;
        FacSearch.searchResultSelected=-1;
        FacSearch.searchResult[type+'.ver']= +new Date();//用来标记搜索结果是否更新
        FacSearch.searchResult[type]=s;
        FacSearch.searchType=type;
        FacSearch.showSearchRes(type,FacSearch.showPageNumber[type]=0);
        if(!dontReLocation)$location.path('/search-old');
        return $q.resolve(s);
      }
    );

  }


  FacSearch.showSearchRes=function (type,pn){
    FacSearch.hideInfoWindow();
    FacMap.selPositionEnd();
    
    FacSearch.searchType=type;
    FacSearch.showPageNumber[type]=pn;
    var ps=FacSearch.showPageSize;
    var ln=FacSearch.searchResult[type].length;
    
    FacSearch.showCount=Math.min(ps,ln-pn*ps);

    FacSearch.newSearchMarkers(FacSearch.searchResult[type],pn*ps,ps,FacSearch.infoOfObj,type);

  }
  FacSearch.clearResult=function (type){
    FacMap.selPositionStart('search','选点搜周边');
    FacSearch.searchResult[type]=[];
    FacSearch.searchResult[type+'.ver']=0;
    FacSearch.searchResultSelected=-1;
    FacSearch.searching=0;
    FacSearch.newSearchMarkers([],0,0,0,type);//清除地图中的标记
  }


  /**
   * 显示产能或项目到地图上
   * 显示内容：图标 + 文字
   * 在地图及UI备妥（承诺）后，才显示
   */
  FacSearch.markObj = function(obj, type) {
    $q.when(FacMap.AwesomeMarker, ()=>{
      FacMap.clearAllMark();
      var pos = [obj.lngE7/1E7, obj.latE7/1E7];
      var mark = FacMap.newMarker('#fff','16px',objIcons[type],pos,false,(''+ obj.name).substr(0,4));
      FacMap.searchMarkers = [mark];
      mark.show();
      mark.selIndex = 0;
      FacSearch.showObjInfoWindow(obj, type, -32);
      mapData.map.setZoomAndCenter(10, pos);
      mark.on('click', function(e){
        FacSearch.showObjInfoWindow(obj, type, -32);
      });
    });
  }
  /**
   * 显示产能或项目到地图上(多个)
   * 显示内容：图标 + 文字
   * 在地图及UI备妥（承诺）后，才显示
   */
  FacSearch.markObjList = function(list, type){
    FacSearch.searching = false;
    if(!list || !list.length) return $q.when(1);
    return $q.when(FacMap.AwesomeMarker, ()=>{
      FacMap.clearAllMark();
      FacMap.searchMarkers = [];
      for(let obj of list) {
        var pos = [obj.lngE7/1E7, obj.latE7/1E7];
        var mark = FacMap.newMarker('#fff','16px',objIcons[type],pos,false,(''+ obj.name).substr(0,4));
        FacMap.searchMarkers.push(mark);
        mark.show();
        mark.on('click', function(e){
          FacSearch.showObjInfoWindow(obj, type, -32);
        });
      }
    });
  }


    
  FacSearch.newSearchMarkers=function(rs,first,len,infoOfObj,type) {
    
    //selMarker已ready，说明可以安全地创建其他marker
    FacMap.getSelMarker().then(function(){
      FacMap.clearAllMark();

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
        } else {
          lng=1215044340;
          lat= 312849830;//同济文远楼
        }
      
        FacMap.searchMarkers[j]=FacMap.newMarker('#fff','16px',objIcons[type],[lng/1E7,lat/1E7],false,(''+rs[i].name).substr(0,4));
        FacMap.searchMarkers[j].show();
        
        FacMap.searchMarkers[j].selIndex=i;
        FacMap.searchMarkers[j].on('click', function(e){
          FacSearch.selectOne(e.target.selIndex,type);
        });
      }
      maxlng/=1e7;
      minlng/=1e7;
      maxlat/=1e7;
      minlat/=1e7;
      
      //大约显示至 2km 范围
      if(Math.abs(minlng)>180)minlng=FacMap.selectedPosition.lng-0.01;
      if(Math.abs(minlat)>180)minlat=FacMap.selectedPosition.lat-0.01;
      if(Math.abs(maxlng)>180)maxlng=FacMap.selectedPosition.lng+0.01;
      if(Math.abs(maxlat)>180)maxlat=FacMap.selectedPosition.lat+0.01;

      FacMap.searchMarkersBounds[type]=new AMap.Bounds([minlng,minlat],[maxlng,maxlat]);
      mapData.map.setBounds(FacMap.searchMarkersBounds[type]);
      //mapData.map.panBy(0,12);
      //由于存在坐标是0的，所以用fit会显示非洲，不好
      mapData.map.setFitView(FacMap.searchMarkers);
    })
  }




  FacSearch.showSearchMarkers=function(s,type) {
    
    if(s&&FacMap.searchMarkers.length) {
      FacMap.selPositionEnd();
    }
    FacSearch.searchType=type;
    for(var i=0;i<FacMap.searchMarkers.length;i++) {
      if(s)FacMap.searchMarkers[i].show();
      else FacMap.searchMarkers[i].hide();
    }
    if(s&&FacMap.searchMarkersBounds[type]) {
      mapData.map.setBounds(FacMap.searchMarkersBounds[type]);
      //mapData.map.panBy(0,12);
      //由于存在坐标是0的，所以用fit会显示非洲，不好
      mapData.map.setFitView(FacMap.searchMarkers);
    }
  }

  FacSearch.selectOne=function(i,type) {
    
    FacSearch.showInfoWindow(i,type);
    $timeout(function(){
      //if(FacSearch.options.distSelect>4)//不限距离时，
      //  FacSearch.options.distSelect='1';//下次自动改为100km
      FacSearch.searchResultSelected=i;
    },178);
    //178.2这里延时不能小于下面unselectOne，否则选中后，又马上被取消选中
    //另外这里延时绝对数不能太小，否则相当于没有延时，同上。
  }
  FacSearch.unselectOne=function() {
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
    var o=FacSearch.searchResult[type][i];
    FacSearch.showObjInfoWindow(o,type,-32);
  }  
  FacSearch.showObjInfoWindow=function(obj,type,offsetY) {
    var da=FacSearch.infoOfObj(obj,type);
    
    FacMap.getInfoWindow().then(function(iw){

      AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow)
      {

        FacMap.infoWindow.close();
        FacMap.infoWindow = new SimpleInfoWindow({
          offset: new AMap.Pixel(0, offsetY)
        });

        FacMap.infoWindow.setInfoTitle(da.infoTitle);

        //设置标题内容
        FacMap.infoWindow.setInfoBody(da.infoBody);

        //设置主体内容
        FacMap.infoWindow.setInfoTplData(da.infoTplData);
        FacMap.infoWindow.open(mapData.map, [obj.lngE7/1e7,obj.latE7/1e7]);
      
        FacMap.infoWindow.on('close', function(e){
          FacSearch.unselectOne();
        })
        
      })
    });
  }  
  
  FacSearch.getDetail = function(type, id, reRequest) {
    if( !FacSearch.isTypeValid(type) ) {
      return $q.reject('errType');
    }
    if(!reRequest && FacSearch.datailCache[type + id]) {
      return $q.resolve(FacSearch.datailCache[type+id]);
    }

    return SIGN.postLaolin('steeobj','detail',{type:type,id:id}).then(function(s){
      if(!s) {
        return $q.reject('noData');
      }
      objDefines[type].formatObj(s);
      FacSearch.datailCache[type+id]=s;      
      return FacSearch.datailCache[type+id];
    },function(e){
      return $q.reject(e);
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
      '<a href="#!/fac-detail/<%- id %>?tabIndex=2">【业绩】</a>'
      //'<a href="#!/fac-detail/<%- id %>">【详细】</a>'
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
      '采购量<%- need_steel %>吨<br>'+
      '供货时间：<%- in_month %><br/>'+
      '<%- update_at %>更新'+
      '<a href="#!/project-detail/<%- id %>">【详情】</a><br/>'
      ;

      //设置主体内容
      var dt=new Date(1000*o.update_at);
      var u_at=(dt.getYear()+1900)+'.'+(dt.getMonth()+1)+'.'+dt.getDate();
      data.infoTplData={
        name:o.name,
        need_steel:o.need_steel,
        size:o.size,
        update_at:u_at,
        in_month:ProjDefine.objReqInMonth[o.in_month],
        id:o.id
      };
    }
    return data;
        
  }  
  
  //从搜索结果 obj[j] 生成 weui-cells的数据
  FacSearch.cellOfObj=function(obj,j,type,linkUrl_Or_fnOnCLick) {
    if(type=='steeproj'){
      return {
          text:''+(j+1)+'.'+obj[j].name+'，采购量'+obj[j].need_steel+
          '吨，首批供货时间：'+ProjDefine.objReqInMonth[obj[j].in_month],
          url:linkUrl_Or_fnOnCLick,
          //url:,
          icon:'university'}
    }
    if(type=='steefac'){
      return {
          text:''+(j+1)+'.'+obj[j].name+'，剩余产能'+obj[j].cap_6m+
          '吨，擅长构件：'+obj[j].goodat,
          url:linkUrl_Or_fnOnCLick,
          icon:'cube'}
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
    return {val:0,name:'undef',unit:''};
  }
  
  return  FacSearch;
  
}]);
 
  

})();