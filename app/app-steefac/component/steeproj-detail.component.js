'use strict';

angular.module('steefac')
.component('steeprojDetail',{
templateUrl: 'app-steefac/component/steeproj-detail.component.template.html',
bindings: {
  fac:'<',
  
  canEdit:'<',
  uids:'<',
  usersInfo:'<',
  
  
},
controller:['$log','AppbData','FacUser','ProjDefine','FacSearch',
function ($log,AppbData,FacUser,ProjDefine,FacSearch) {
  var ctrl=this;
  var userData=AppbData.getUserData();
  
  
  
  ctrl.$onInit=function(){
    $log.log('===============facsShow',ctrl.facIds);
    
    ctrl.reqInMonth=ProjDefine.objReqInMonth[ctrl.fac.in_month]

    ctrl.id=ctrl.fac.id;
    ctrl.FacUser=FacUser;
    
  

    
  }
  ctrl.$onChanges=function(chg){

  }
  
  
}]
});
