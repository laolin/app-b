'use strict';

angular.module('steefac')
.component('facResult',{
  templateUrl: 'app-steefac/search/fac-result.component.template.html',
  bindings: {
    resultTime: '<',
    searchData: '<'
  },
  controller:['$http','$log','$interval',
	function ($http,$log,$interval) {
      var ctrl=this;
      
      
      ctrl.$onInit=function(){
        $log.log('facResult.onInit');
      }
      ctrl.$onChanges=function(chg){
        $log.log('facResult.onChanges');
        if(chg.resultTime) {
          ctrl.cellsTitle='共'+ctrl.searchData.result.length+'个结果';
          var r=ctrl.searchData.result;
          ctrl.cells=[];
          for(var i=0;i<r.length;i++){
            ctrl.cells[i]={
              text:r[i].name+'-'+ctrl.level[r[i].level]+
                '('+r[i].license+')'+r[i].province,
              url:"/fac-detail?id="+r[i].id,
              icon:'id-card'};
          }
          
        }
      }
      ctrl.level=['特级','一级','二级','三级'];
      ctrl.cells=function(){
        return [1,2,3];
      }
    }
  ]
});
