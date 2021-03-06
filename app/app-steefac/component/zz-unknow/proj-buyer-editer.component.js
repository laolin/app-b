'use strict';
angular.module('steefac')
.component('projBuyerEditer',{
templateUrl: 'app-steefac/component/zz-unknow/proj-buyer-editer.component.template.html',
bindings: {
  id:'<'
},
controller:['$location','$log','AppbData','SIGN','SteeBuyer',
function ($location,$log,AppbData,SIGN,SteeBuyer) {
  var appData=AppbData.getAppData();
  var ctrl=this;
  
  var buyerList=SteeBuyer.buyerList;
  
  ctrl.det={};
  ctrl.buyerList=SteeBuyer.buyerList;
  ctrl.title0='采购商列表';
  
  function onChange(n) {
    var i,sum=0,sel='';
    
    for(var i=0;i<allSel;i++) {
      if(ctrl.checkData.values[i]){
        if(sum)sel+=',';
        sel+=ctrl.checkData.options[i];
        sum++;
      }
    }
    goodat=sel;
    if(sum>ctrl.maxSel) {
      appData.toastMsg('最多选择'+ctrl.maxSel+'项',3);
      ctrl.checkData.values[n]=false;
      return onChange((n+1)%allSel)
    }

    ctrl.nSel=sum;
    if(sum)
      ctrl.checkData.footerText=sum+'/'+ctrl.maxSel+'已选:'+sel;
    else
      ctrl.checkData.footerText='请选'+ctrl.minSel+'~'+ctrl.maxSel+'项';
  }
  
  //确定按钮事件
  ctrl.onOk=function() {
    var d={goodat:goodat}
    SIGN.postLaolin('steeobj','update',{type:'steefac',id:ctrl.id,d:JSON.stringify(d)}).then(function(s){
      if(!s) {
        return appData.toastMsg('未修改',3);
      }
      delete FacSearch.datailCache['steefac'+ctrl.id];
      $location.path( "/obj-detail" ).search({id:ctrl.id,type:'steefac'});
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
      goodat=s.goodat;
      initCheckbox();
    },function(e){
      return appData.showInfoPage('发生错误',e+', id:'+ctrl.id,'/search')
    });
  }
  function initCheckbox(){
    var ga=[];
    if(goodat)ga=goodat.split(',');
    ctrl.checkData= {
      title: ctrl.det.name+'的擅长构件',
      namePrefix: 'goodat_', //自会动命名为：goodat_0 , goodat_1
      values:[],
      options:options,
      
      onChange:onChange,
      footerText:'最多选3项',
      footerLink:''      
    };
    var i,j;
    for(var i=ga.length;i--;) {
      j=options.indexOf(ga[i]);
      if(j>=0)ctrl.checkData.values[j]=true;
    }
    onChange(0);
    
  }


  

        
        
//---------------------------
}]
});
