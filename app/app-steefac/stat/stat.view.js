'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/stat', {
  pageTitle: "全国钢构产能",
templateUrl: 'app-steefac/stat/stat.view.template.html',
controller: ['$scope','$timeout','$log','$location',
'AppbData','AppbAPI','AmapMainData','FacSearch',
function ($scope,$timeout,$log,$location,
AppbData,AppbAPI,AmapMainData,FacSearch) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();
  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  $scope.$on('$viewContentLoaded', function () {
    ctrl.isLoading=1;
    ctrl.isError=false;
    ctrl.allObj=[];
    ctrl.selcctObj={};
    ctrl.pointReader=false;
    ctrl.FacSearch=FacSearch;
  });
  $scope.$on('$destroy', function () {
    if(ctrl.pointReader)ctrl.pointReader.setData([]);
    FacSearch.hideInfoWindow();
  });
  
  ctrl.objType=$location.search().type; 
  
  if(!FacSearch.isTypeValid(ctrl.objType)) {
    ctrl.objType='steefac';
  }

 //style-3
  var renderOptions_def3 = {
    "drawQuadTree": false,
    "drawPositionPoint": false,
    "drawShadowPoint": true,
    "disableHardcoreWhenPointsNumBelow": 0,
    "pointStyle": {//点
      "content": "circle",
      "width": 5,
      "height": 5,
      "fillStyle": "#2e25c0",
      "lineWidth": 1,
      "strokeStyle": null
    },
    "topNAreaStyle": {//TopN区域
      "autoGlobalAlphaAlpha": true,
      "content": "rect",
      "fillStyle": "#e25c5d",
      "lineWidth": 1,
      "strokeStyle": null
    },
    "pointHardcoreStyle": {//点的硬核部分
      "content": "rect",
      "width": 2,
      "height": 2,
      "lineWidth": 1,
      "fillStyle": null,
      "strokeStyle": null
    },
    "pointPositionStyle": {//定位点
      "content": "circle",
      "width": 5,
      "height": 5,
      "lineWidth": 1,
      "strokeStyle": null,
      "fillStyle": "#cc0000"
    },
    "pointHoverStyle": {//鼠标hover时的覆盖点
      "width": 5,
      "height": 5,
      "content": "circle",
      "fillStyle": null,
      "lineWidth": 2,
      "strokeStyle": "#ff2828"
    },
    "shadowPointStyle": {//空间被占用的点
      "fillStyle": "rgba(188,0,0,0.2)",
      "content": "circle",
      "width": 5,
      "height": 5,
      "lineWidth": 1,
      "strokeStyle": null
    }
  }; 
  
  //style 2:
  var renderOptions_def = {
    "drawQuadTree": false,
    "drawPositionPoint": false,
    "drawShadowPoint": true,
    "disableHardcoreWhenPointsNumBelow": 0,
    "pointStyle": {//点
      "content": "circle",
      "width": 15,
      "height": 15,
      "fillStyle": "#2e25c0",
      "lineWidth": 1,
      "strokeStyle": null
    },
    "topNAreaStyle": {//TopN区域
      "autoGlobalAlphaAlpha": true,
      "content": "rect",
      "fillStyle": "#e25c5d",
      "lineWidth": 1,
      "strokeStyle": null
    },
    "pointHardcoreStyle": {//点的硬核部分
      "content": "rect",
      "width": 15,
      "height": 15,
      "lineWidth": 1,
      "fillStyle": null,
      "strokeStyle": null
    },
    "pointPositionStyle": {//定位点
      "content": "circle",
      "width": 15,
      "height": 15,
      "lineWidth": 1,
      "strokeStyle": null,
      "fillStyle": "#cc0000"
    },
    "pointHoverStyle": {//鼠标hover时的覆盖点
      "width": 15,
      "height": 15,
      "content": "circle",
      "fillStyle": null,
      "lineWidth": 2,
      "strokeStyle": "#ff2828"
    },
    "shadowPointStyle": {//空间被占用的点
      "fillStyle": "rgba(188,0,0,0.2)",
      "content": "circle",
      "width": 15,
      "height": 15,
      "lineWidth": 1,
      "strokeStyle": null
    }
  };  
 
  var renderOptions_def1 = {
    "drawQuadTree": false,
    "drawPositionPoint": false,
    "drawShadowPoint": true,
    "disableHardcoreWhenPointsNumBelow": 0,
    "pointStyle": {//点
      "content": "circle",
      "width": 10,
      "height": 10,
      "fillStyle": "#2e25c0",
      "lineWidth": 1,
      "strokeStyle": null
    },
    "topNAreaStyle": {//TopN区域
      "autoGlobalAlphaAlpha": true,
      "content": "rect",
      "fillStyle": "#e25c5d",
      "lineWidth": 1,
      "strokeStyle": null
    },
    "pointHardcoreStyle": {//点的硬核部分
      "content": "rect",
      "width": 2,
      "height": 2,
      "lineWidth": 1,
      "fillStyle": null,
      "strokeStyle": null
    },
    "pointPositionStyle": {//定位点
      "content": "circle",
      "width": 5,
      "height": 5,
      "lineWidth": 1,
      "strokeStyle": null,
      "fillStyle": "#cc0000"
    },
    "pointHoverStyle": {//鼠标hover时的覆盖点
      "width": 10,
      "height": 10,
      "content": "circle",
      "fillStyle": null,
      "lineWidth": 2,
      "strokeStyle": "#ff2828"
    },
    "shadowPointStyle": {//空间被占用的点
      "fillStyle": "rgba(188,0,0,0.5)",
      "content": "circle",
      "width": 20,
      "height": 20,
      "lineWidth": 1,
      "strokeStyle": null
    }
  };
  var renderOptionsGroups={};
  renderOptionsGroups['steefac']=angular.copy(renderOptions_def);
  renderOptionsGroups['steeproj']=angular.copy(renderOptions_def);
  renderOptionsGroups['steefac'].pointStyle.fillStyle='#2e25c0';
  renderOptionsGroups['steeproj'].pointStyle.fillStyle='#03d780';
  renderOptionsGroups['steefac'].shadowPointStyle.fillStyle='rgba(0,0,188,0.5)';
  renderOptionsGroups['steeproj'].shadowPointStyle.fillStyle='rgba(0,188,0,0.5)';
  
  
  function showObjToMap(obj){
    var map=appData.mapData.map;
    map.setZoom(4);
    var d_lng=1215044340;//同济文远楼
    var d_lat= 312849830;
  
    //333333333333333333333333333333333
    AMapUI.load(['ui/misc/PointSimplifier'], function(PointSimplifier) {
      var pointSimplifierIns = new PointSimplifier({
        zIndex: 100,
        map: map,
        getPosition: function(item) {
          if (!item) {
              return null;
          }
          if(item.lngE7>0 && item.latE7>0)
            return[item.lngE7/1e7,item.latE7/1e7];
          return[d_lng/1e7,d_lat/1e7];
        },
        compareDataItem: function(a, b, aIndex, bIndex) {
          //数据源头部的优先
          return aIndex > bIndex ? 1 : -1;
        },
        getHoverTitle: function(item, idx) {
          return item.name;
        },
        //renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: renderOptionsGroups[ctrl.objType]
      });
      ctrl.pointReader=pointSimplifierIns;
      pointSimplifierIns.setData(obj);
      //监听事件
      pointSimplifierIns.on('pointClick', function(e, record) {
        $timeout(function(){
          ctrl.selcctObj=record.data;
          FacSearch.showObjInfoWindow(record.data,ctrl.objType,-5);
        },78);
      });
    });
  //333333333333333333333333333333333
  };

  




  AppbAPI('steeobj','overview_addr',{type:ctrl.objType}).
  then(function(s){
    ctrl.isLoading--;
    ctrl.allObj=s;
    appData.mapData.ready(function(){showObjToMap(s)})  
  },function(e){
    console.log('steeobj','overview_addr steefac',e);
    ctrl.isError=true;
  })
  

  }
]
});
}]);
