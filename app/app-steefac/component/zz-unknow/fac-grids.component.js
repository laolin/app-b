'use strict';

angular.module('steefac')
.component('facGrids',{
  templateUrl: 'app-steefac/component/zz-unknow/fac-grids.component.template.html',
  bindings: {
    facList:"=",
    type:"=",
    //pageNumber: '<',
    //pageSize: '<',
    resultVer: '<',//用来标记搜索结果变化的
    
    title:'<',
    
  },
  controller:['FacUser','FacSearch','ProjDefine',
	function (FacUser,FacSearch,ProjDefine) {
    var ctrl=this;
    
    ctrl.cells=[];
    ctrl.pageSize=100;
    ctrl.pageNumber=0;
    ctrl.$onInit=function(){
    }
    ctrl.$onChanges=function(chg){
      if(1) {
        var r=ctrl.facList;
        if(!r || !r.length)return;
        ctrl.cells=genCells(r);
      }
    }// end onChanges


    function clickFac(cell){
      FacUser.clickFac(cell.fac, cell.type);
    }

    function genCells(r) {
      var cells=[];
      var sum=0;
      var val;
      if(!r  )return;
      var ps=ctrl.pageSize;
      var pn=ctrl.pageNumber;
      var hImg={'steefac':120,'steeproj':80};
      var nCol={'steefac':2,'steeproj':2};
      function _text_of_obj(o,type) {
        if(type=='steefac') {
          return o.name+'，产能'+o.cap_6m+'吨，擅长构件：'+o.goodat;
        }
        if(type=='steeproj') {
          return o.name+'，采购'+o.need_steel+'吨，首批供货时间：'+ProjDefine.objReqInMonth[o.in_month];
        }
      }
      var linkPrev = ctrl.type=='steeproj' && '/project-detail/' || '/fac-detail/';
      for(var i=0,j=ps*pn;i<ps&&j<r.length;i++,j++){
        cells[i]={
          //link:"/obj-detail?type="+ctrl.type+"&id="+r[j].id,
          link: clickFac, //linkPrev + r[j].id,
          fac: r[j],
          type: ctrl.type,
          img:r[j].picMain || '../assets/img/img-steefac/def-'+ctrl.type+'.jpg',
          text:_text_of_obj(r[j],ctrl.type),
          nCol:nCol[ctrl.type],
          h:hImg[ctrl.type]
        }
        
      }
      return cells;
    }
  }]
});
