'use strict';
(function(){

angular.module('exbook')
.component('ebInput',{
  templateUrl: 'view-exbook/exbook/eb-input.component.template.html',  
  bindings: { 
    appData:"<",
    //注意，
    // 本 component 里修改了 ebData 的值
    // 这里 ebData 虽然是“单向绑定”，
    // 但其实传递来的是变量的引用，所以是双向影响值的
    //用单向绑定，目的是为了外部变化能自动调用$onChange
    ebData:"<" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      

      ctrl.maxTextLength=999;
      ctrl.updateImg=function(img) {
        ctrl.ebData.draft.pics=img.join(',');
        ctrl.ebData.changeMark('pics');
      }
      ctrl.$onInit=function(){
        $log.log('ebData',ctrl.ebData);
        intervalRes=$interval(ctrl.ebData.updateData,15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){
        $log.log(' 2 ** exbookInput onChanges',chg);
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
