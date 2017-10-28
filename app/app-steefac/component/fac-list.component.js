'use strict';

angular.module('steefac')
.component('facList',{
  templateUrl: 'app-steefac/component/fac-list.component.template.html',
  bindings: {
    facList:"=",
    type:"=",
    pageNumber: '=',
    pageSize: '=',
    resultVer: '<',//用来标记搜索结果变化的
    
    title:'<',
    searchData:'<'
    
  },
  controller:['$http','$log','FacSearch',
	function ($http,$log,FacSearch) {
    var ctrl=this;
    
    ctrl.cells=[];
    
    ctrl.$onInit=function(){
      $log.log('facUiFacList.onInit');
    }
    ctrl.$onChanges=function(chg){
      $log.log('facUiFacList.onChanges');
      if(1) {
        var r=ctrl.facList;
        if(!r || !r.length)return;
        ctrl.cells=genCells(r);
      }
    }// end onChanges
    function genCells(r) {
      var cells=[];
      var sum=0;
      var val;
      if(!r  )return;
      var ps=ctrl.pageSize;
      var pn=ctrl.pageNumber;
      
      for(var i=0,j=ps*pn;i<ps&&j<r.length;i++,j++){
        cells[i]=FacSearch.cellOfObj(r,j,ctrl.type,"/obj-detail?type="+ctrl.type+"&id="+r[j].id);
      }
      return cells;
    }
  }]
});
