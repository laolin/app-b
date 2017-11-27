'use strict';

angular.module('steefac')
.component('buyerGrids',{
  templateUrl: 'app-steefac/component/buyer-grids.component.template.html',
  bindings: {
    buyerList:"=",
    links:"=",
    resultVer: '<',//用来标记搜索结果变化的
    
    title:'<',
    
  },
  controller:['$http','$log','SteeBuyer',
	function ($http,$log,SteeBuyer) {
    var ctrl=this;
    
    ctrl.cells=[];
    ctrl.pageSize=100;
    ctrl.pageNumber=0;
    ctrl.$onInit=function(){
      //$log.log('facList.onInit',ctrl.facList,ctrl.title,ctrl.type);
    }
    ctrl.$onChanges=function(chg){
      if(1) {
        var r=ctrl.buyerList;
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
      var hImg=80;
      var nCol=2;
      for(var i=0,j=ps*pn;i<ps&&j<r.length;i++,j++){
        cells[i]={
          link:ctrl.links&&ctrl.links[j]||'',
          img:r[j].kPic || SteeBuyer.defImg,
          text:r[j].kName,
          nCol:nCol,
          h:hImg
        }
        
      }
      return cells;
    }
  }]
});
