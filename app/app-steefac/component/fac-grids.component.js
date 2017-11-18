'use strict';

angular.module('steefac')
.component('facGrids',{
  templateUrl: 'app-steefac/component/fac-grids.component.template.html',
  bindings: {
    facList:"=",
    type:"=",
    //pageNumber: '<',
    //pageSize: '<',
    resultVer: '<',//用来标记搜索结果变化的
    
    title:'<',
    
  },
  controller:['$http','$log','FacSearch',
	function ($http,$log,FacSearch) {
    var ctrl=this;
    
    ctrl.cells=[];
    ctrl.pageSize=100;
    ctrl.pageNumber=0;
    ctrl.$onInit=function(){
      //$log.log('facList.onInit',ctrl.facList,ctrl.title,ctrl.type);
    }
    ctrl.$onChanges=function(chg){
      if(1) {
        var r=ctrl.facList;
        if(!r || !r.length)return;
        ctrl.cells=genCells(r);
      }
      $log.log('facUiFacList.onChanges',ctrl.cells);
    }// end onChanges
    function genCells(r) {
      var cells=[];
      var sum=0;
      var val;
      if(!r  )return;
      var ps=ctrl.pageSize;
      var pn=ctrl.pageNumber;
      var hImg={'steefac':50,'steeproj':120};
      var nCol={'steefac':2,'steeproj':3};
      for(var i=0,j=ps*pn;i<ps&&j<r.length;i++,j++){
        cells[i]={
          link:"/obj-detail?type="+ctrl.type+"&id="+r[j].id,
          img:r[j].picMain || '../assets/img/img-steefac/def-'+ctrl.type+'.jpg',
          text:r[j].name,
          nCol:nCol[ctrl.type],
          h:hImg[ctrl.type]
        }
        
      }
      return cells;
    }
  }]
});
