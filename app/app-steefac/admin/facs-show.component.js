'use strict';

angular.module('steefac')
.component('facsShow',{
templateUrl: 'app-steefac/admin/facs-show.component.template.html',
bindings: {
  title:'<',
  type:'<',
  facIds:'<',
},
controller:['$log','AppbData','FacUser','FacApi',
function ($log,AppbData,FacUser,FacApi) {
  var ctrl=this;
  var userData=AppbData.getUserData();
  
  
  
  ctrl.isLoading=1;
  ctrl.facList=[];
  
  
  ctrl.$onInit=function(){
    $log.log('===============facsShow',ctrl.facIds);
    getList(ctrl.facIds);
  }
  ctrl.$onChanges=function(chg){

  }
  
  function getList(facIds) {
    return FacApi.callApi('steefac','li',{ids:facIds}).then(function(s){
      ctrl.isLoading=0;
      $log.log('===============steefac li ok',s);
      ctrl.facList=s;
    });
  }
  
}]
});
