'use strict';

angular.module('steefac')
.component('facsShow',{
templateUrl: 'app-steefac/component/facs-show.component.template.html',
bindings: {
  title:'<',
  type:'<',
  facIds:'<',
},
controller:['$log','AppbData','FacUser','AppbAPI',
function ($log,AppbData,FacUser,AppbAPI) {
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
    return AppbAPI('steefac','li',{ids:facIds}).then(function(s){
      ctrl.isLoading=0;
      $log.log('===============steefac li ok',s);
      ctrl.facList=s;
    });
  }
  
}]
});
