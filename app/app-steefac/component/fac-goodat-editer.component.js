'use strict';
angular.module('steefac')
.component('facGoodatEditer',{
templateUrl: 'app-steefac/component/fac-goodat-editer.component.template.html',
bindings: {
  goodatObj:'<'
},
controller:['$http','$log','FacSearch',
function ($http,$log,FacSearch) {
  var ctrl=this;
  
  var options=['轻型','管结构','十字柱','箱形柱','BH','桁架','网架','减震产品','其它'];
  function onChange(n) {
    var i,sum=0,sel='';
    
    for(var i=ctrl.checkData.options.length;i--;) {
      if(ctrl.checkData.values[i]){
        if(sum)sel+=',';
        sel+=ctrl.checkData.options[i];
        sum++;
      }
    }
    ctrl.goodatObj.goodat=sel;
    if(sum)
      ctrl.checkData.footerText=sum+'已选:'+sel;
    else
      ctrl.checkData.footerText='最多选3项';
  }
  ctrl.$onInit=function(){
    $log.log('facGoodatEditer onInit',ctrl.goodatObj);
    var ga=ctrl.goodatObj.goodat.split(',');
    ctrl.checkData= {
      title: '擅长构件',
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
