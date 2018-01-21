'use strict';
angular.module('steefac')
.component('facFeeEditer',{
templateUrl: 'app-steefac/component/fac-fee-editer.component.template.html',
bindings: {
  id:'<'
},
controller:['$location','$log','AppbData','AppbAPI','FacDefine','FacSearch',
function ($location,$log,AppbData,AppbAPI,FacDefine,FacSearch) {
  var appData=AppbData.getAppData();
  var ctrl=this;
  
  var options=FacDefine.goodatOptions;
  ctrl.models={};
  ctrl.inputs=[];
  ctrl.onChange=onChange;
  
  ctrl.formDefine={onChange:ctrl.onChange,inputs:ctrl.inputs};
  
  ctrl.det=false;
  ctrl.dataOK=false; 
  ctrl.dmin=1;
  ctrl.dmax=9999;
  
  ctrl.fee={};
  var feeStr=''
  
  
  function onChange(n) {
    $log.log('onChange',n,ctrl.models)
    var i,j,ok=1;

    ok=0;//加工费改为选填，随便一项填好就行
    for(var i=0;i<options.length;i++) {
      j=ctrl.models[i];
      if(!j || j<ctrl.dmin || j>ctrl.dmax ) {
        //ok=0;//加工费改为选填，随便一项填好就行
        //break;//加工费改为选填，随便一项填好就行
      }
      else {
        ok=1;//加工费改为选填，随便一项填好就行
      }
    }
    ctrl.dataOK=ok;
    
    feeStr=JSON.stringify(ctrl.models);
  }
    
  
  //确定按钮事件
  ctrl.onOk=function() {
    var d={fee:feeStr}
    AppbAPI('steeobj','update',{type:'steefac',id:ctrl.id,d:JSON.stringify(d)}).then(function(s){
      if(!s) {
        return appData.toastMsg('未修改',3);
      }
      delete FacSearch.datailCache['steefac'+ctrl.id];
      $location.path( "/fac-detail/" + ctrl.id);
      return appData.toastMsg('已修改',3);
    },function(e){
      return appData.toastMsg(e,3);
    });
  }
  
  
  

  
  
  
  ctrl.$onInit=function(){
    FacSearch.getDetail('steefac',ctrl.id).then(function(s){
      if(!s) {
        return appData.showInfoPage('参数错误','Err id: '+ctrl.id,'/search')
      }
      ctrl.det=s;
      if(s.fee)ctrl.fee=JSON.parse(s.fee);
      initData();
    },function(e){
      return appData.showInfoPage('发生错误',e+', id:'+ctrl.id,'/search')
    });
  }
  function initData(){    
    for(var i=options.length;i--;) {
      ctrl.inputs[i]= {
        name: i,
        desc: options[i],
        type: 'number',
        placeholder:ctrl.dmin+'~'+ctrl.dmax+'（元/吨）',
        required: 0,
        min: ctrl.dmin,
        max: ctrl.dmax
      }
      ctrl.models[i]=ctrl.fee[i];
    }
    onChange(0);
    
  }


  

        
        
//---------------------------
}]
});
