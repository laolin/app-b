'use strict';
angular.module('steefac')
.component('facEditerContact',{
templateUrl: 'app-steefac/component/fac-editer-contact.component.template.html',
bindings: {
  id:'<'
},
controller:['$location','$log','AppbData','AppbAPI','FacSearch',
function ($location,$log,AppbData,AppbAPI,FacSearch) {
  var appData=AppbData.getAppData();
  var ctrl=this;
  
  var objType='steefac';
  
  var options=['contact_person','contact_tel','contact_email'];
  ctrl.models={};
  ctrl.inputs=[];
  ctrl.onChange=onChange;
  
  
  ctrl.det=false;
  ctrl.dataOK=false;
  
  ctrl.data={};

  
  $log.log('facEditerContact - - - - - - -' )
  
  function onChange(n) {
    $log.log('onChange',n,ctrl.models);
    var i,j,ok=1;
    
    for(var i=0;i<options.length;i++) {
      j=ctrl.models[options[i]];
      if(!j   ) {
        ok=0;
        break;
      }
      ctrl.data[options[i]]=ctrl.models[options[i]];
    }
    ctrl.dataOK=ok;
  }
    
  
  //确定按钮事件
  ctrl.onOk=function() {
    var d=ctrl.data;
    AppbAPI('steeobj','update',{type:objType,id:ctrl.id,d:JSON.stringify(d)}).then(function(s){
      if(!s) {
        return appData.toastMsg('未修改',3);
      }
      delete FacSearch.datailCache[objType+ctrl.id];
      $location.path( "/obj-detail" ).search({id: id,type:objtype});
      return appData.toastMsg('已修改',3);
    },function(e){
      return appData.toastMsg(e,3);
    });
  }
  
  
  

  
  
  
  ctrl.$onInit=function(){
    FacSearch.getDetail(objType,ctrl.id).then(function(s){
      if(!s) {
        return appData.showInfoPage('参数错误','Err id: '+ctrl.id,'/search')
      }
      ctrl.det=s;
      //if(s.fee)ctrl.contact=JSON.parse(s.fee);
      initData();
    },function(e){
      return appData.showInfoPage('发生错误',e+', id:'+ctrl.id,'/search')
    });
  }
  function initData(){
    ctrl.inputs= [
      {
        name: 'contact_person',
        desc: '联系人',
        type: 'text',
        placeholder:'请输入联系人',
        required: 1,
        minlength: 2,
        maxlength: 16
      },{
        name: 'contact_tel',
        desc: '联系电话',
        type: 'tel',
        placeholder:'建议输入手机号',
        required: 1
      },{
        name: 'contact_email',
        desc: '电子邮箱',
        type: 'email',
        placeholder:'请输入电子邮箱',
        required: 1
      }
    ];
    ctrl.formDefine={onChange:ctrl.onChange,inputs:ctrl.inputs};

    ctrl.models['contact_person']=ctrl.det['contact_person'];
    ctrl.models['contact_tel']=ctrl.det['contact_tel'];
    ctrl.models['contact_email']=ctrl.det['contact_email'];
    onChange(0);
    
  }


  

        
        
//---------------------------
}]
});
