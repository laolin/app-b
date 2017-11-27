'use strict';

angular.module('steefac')
.component('steefacDetail',{
templateUrl: 'app-steefac/component/steefac-detail.component.template.html',
bindings: {
  fac:'<',
  
  canEdit:'<',
  uids:'<',
  usersInfo:'<',
  
  
},
controller:['$log','AppbData','FacUser','FacDefine',
function ($log,AppbData,FacUser,FacDefine) {
  var ctrl=this;
  var userData=AppbData.getUserData();
  
  
  
  var options=FacDefine.goodatOptions;
  ctrl.goodat=[];
  
  ctrl.$onInit=function(){
    $log.log('===============facsShow',ctrl.facIds);
    
    ctrl.id=ctrl.fac.id;
    ctrl.FacUser=FacUser;
    var fee;
    if(ctrl.fac.goodat) {
      ctrl.fac.goodat.split(',').forEach(function(val,ind){
        ctrl.goodat[ind]={text:val,icon:'check-circle',url:''};
        fee=ctrl.fac.feeObj[options.indexOf(val)];
        if(fee)ctrl.goodat[ind]['notes']='加工费'+fee+'元/吨';
      });
    }
    
    ctrl.oldDay=((+new Date)/1000 - ctrl.fac.update_at)/3600/24  ;

    
  }
  ctrl.$onChanges=function(chg){

  }
  
  
}]
});
