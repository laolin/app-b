'use strict';
(function(){

angular.module('appb')
.component('appbUiFeedInput',{
  templateUrl: 'modules/appb-ui/appb-ui-feed-input.component.template.html',  
  bindings: { 
    appData:"<",
    //pics 用单向绑定，外部变化能自动调用$onChange
    pics:"<",
    feedData:"=" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      

      ctrl.maxTextLength=999;
      
      ctrl.updateImg=function(imgs) {
        ctrl.feedData.draft.pics=imgs.join(',');
        ctrl.feedData.changeMark('pics');
      }
      ctrl.$onInit=function(){
        $log.log('feedData',ctrl.feedData.draft.pics,ctrl.feedData);
        intervalRes=$interval(ctrl.feedData.updateData,15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){
        if( chg.pics) {
          if(ctrl.pics)ctrl.imgs=ctrl.pics.split(',');
          else ctrl.imgs=[];
        }

      }
      ctrl.$onDestroy=function(){
        $interval.cancel(intervalRes);
        ctrl.feedData.updateData();
      }

      
      
      
      
      
    }
  ]
})


//___________________________________
})();
