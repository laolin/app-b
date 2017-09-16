'use strict';

angular.module('steefac')
.component('facResult',{
  templateUrl: 'app-steefac/search/fac-result.component.template.html',
  bindings: {
    pageNumber: '=',
    pageSize: '=',
    resultTime: '<',
    searchData: '<'
  },
  controller:['$http','$log','$timeout',
	function ($http,$log,$timeout) {
    var ctrl=this;
    
    
    ctrl.$onInit=function(){
      $log.log('facResult.onInit');
    }
    ctrl.$onChanges=function(chg){
      $log.log('facResult.onChanges');
      if(1) {
        genCells();
        var r=ctrl.searchData.result;
        ctrl.cellsTitle='共'+r.length+'个结果';
        var allPage=Math.ceil(r.length/ctrl.pageSize);
        var onFirst=function (){
            ctrl.searchData.showSearchRes(ctrl.pageNumber=0);
            ctrl.pgData.current=ctrl.pageNumber+1;
            genCells();
        }
        var onLast=function (){
            ctrl.searchData.showSearchRes(ctrl.pageNumber=allPage-1);
            ctrl.pgData.current=ctrl.pageNumber+1;
            genCells();
        }
        var onPrev=function (){
          if(ctrl.pageNumber>0){
            ctrl.searchData.showSearchRes(--ctrl.pageNumber);
            ctrl.pgData.current=ctrl.pageNumber+1;
            genCells();
          }
        }
        var onNext=function (){
          if(ctrl.pageNumber<allPage-1){
            ctrl.searchData.showSearchRes(++ctrl.pageNumber);
            ctrl.pgData.current=ctrl.pageNumber+1;
            genCells();
          }
        }
        ctrl.pgData={
          current:ctrl.pageNumber+1,max:allPage,
          onFirst:onFirst,
          onLast:onLast,
          onPrev:onPrev,
          onNext:onNext
        }
      }
    }// end onChanges
    function genCells() {
      
      var r=ctrl.searchData.result;
      var ps=ctrl.pageSize;
      var pn=ctrl.pageNumber;
      ctrl.cells=[];
      for(var i=0,j=ps*pn;i<ps&&j<r.length;i++,j++){
        ctrl.cells[i]={
          text:r[j].name+'-'+ctrl.level[r[j].level]+
            '('+r[j].license+')'+r[j].province,
          url:"/fac-edit?id="+r[j].id,
          icon:'id-card'};
      }
    }
    
    ctrl.level=['特级','一级','二级','三级'];

  }]
});
