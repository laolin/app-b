'use strict';
(function(){

angular.module('exbook')
.component('ebInput',{
  templateUrl: 'view-exbook/exbook/eb-input.component.template.html',  
  bindings: { 
    appData:"<",
    //注意，
    // 本 component 里修改了 ebData 的值
    
    //pics 用单向绑定，外部变化能自动调用$onChange
    pics:"<",
    ebData:"=" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      

      ctrl.maxTextLength=999;
      
      ctrl.updateImg=function(imgs) {
        ctrl.ebData.draft.pics=imgs.join(',');
        ctrl.ebData.changeMark('pics');
      }
      ctrl.$onInit=function(){
        $log.log('ebData',ctrl.ebData.draft.pics,ctrl.ebData);
        intervalRes=$interval(ctrl.ebData.updateData,15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){
        if( chg.pics) {
          if(ctrl.pics)ctrl.imgs=ctrl.pics.split(',');
          else ctrl.imgs=[];
          $log.log('s2 chg@ebInput',ctrl.pics,ctrl.imgs);
        }

      }
      ctrl.$onDestroy=function(){
        $interval.cancel(intervalRes);
        ctrl.ebData.updateData();
      }

      
      
      
      
      
    }
  ]
})


//___________________________________
})();
