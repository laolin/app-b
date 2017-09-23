'use strict';

angular.module('steefac')
.component('searchProjResult',{
  templateUrl: 'app-steefac/search-proj/search-proj-result.component.template.html',
  bindings: {
    pageNumber: '=',
    pageSize: '=',
    resultVer: '<',//用来标记搜索结果变化的
    searchType: '<',
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
        $log.log('searchProjResult$onChanges',ctrl.searchType,ctrl.searchData.searchResult);
        genCells();
        var r=ctrl.searchData.searchResult[ctrl.searchType];
        if(!r || !r.length)return;
        ctrl.cellsTitle='共'+r.length+'个结果';
        var allPage=Math.ceil(r.length/ctrl.pageSize);
        var onFirst=function (){
            ctrl.searchData.showSearchRes(ctrl.searchType,ctrl.pageNumber=0);
            ctrl.pgData.current=ctrl.pageNumber;
            genCells();
        }
        var onLast=function (){
            ctrl.searchData.showSearchRes(ctrl.searchType,ctrl.pageNumber=allPage-1);
            ctrl.pgData.current=ctrl.pageNumber;
            genCells();
        }
        var onPrev=function (){
          if(ctrl.pageNumber>0){
            ctrl.searchData.showSearchRes(ctrl.searchType,--ctrl.pageNumber);
            ctrl.pgData.current=ctrl.pageNumber;
            genCells();
          }
        }
        var onNext=function (){
          if(ctrl.pageNumber<allPage-1){
            ctrl.searchData.showSearchRes(ctrl.searchType,++ctrl.pageNumber);
            ctrl.pgData.current=ctrl.pageNumber;
            genCells();
          }
        }
        ctrl.pgData={
          current:ctrl.pageNumber,max:allPage,
          onFirst:onFirst,
          onLast:onLast,
          onPrev:onPrev,
          onNext:onNext
        }
      }
    }// end onChanges
    function genCells() {
      
      var r=ctrl.searchData.searchResult[ctrl.searchType];
      ctrl.cells=[];
      if(!r || !r.length)return;
      var ps=ctrl.pageSize;
      var pn=ctrl.pageNumber;
      for(var i=0,j=ps*pn;i<ps&&j<r.length;i++,j++){
        var dt=new Date(1000*r[j].update_at);
        var u_at=(dt.getYear()+1900)+'.'+(dt.getMonth()+1)+'.'+dt.getDate();

        ctrl.cells[i]=ctrl.searchData.cellOfObj(r,j,ctrl.searchType);
      }
    }
    
    ctrl.level=['特级','一级','二级','三级'];

  }]
});
