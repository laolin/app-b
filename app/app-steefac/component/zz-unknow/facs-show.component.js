'use strict';

angular.module('steefac')
.component('facsShow',{
templateUrl: 'app-steefac/component/zz-unknow/facs-show.component.template.html',
bindings: {
  title:'<',
  type:'<',
  facIds:'<',
},
controller:['$log','AppbData','FacUser','SIGN',
function ($log,AppbData,FacUser,SIGN) {
  var ctrl=this;
  var userData=AppbData.getUserData();
  
  
  
  ctrl.isLoading=1;
  ctrl.facList=[];
  
  
  ctrl.$onInit=function(){
    $log.log('===============facsShow',ctrl.facIds);
    if(ctrl.facIds) getList(ctrl.facIds);
    else ctrl.isLoading=0;
  }
  ctrl.$onChanges=function(chg){

  }
  
  function getList(facIds) {
    return SIGN.postLaolin('steeobj','li',{type:ctrl.type,ids:facIds}).then(function(s){
      ctrl.isLoading=0;
      $log.log('===============steefac li ok',s);
      ctrl.facList=s;
    });
  }
  
}]
});
