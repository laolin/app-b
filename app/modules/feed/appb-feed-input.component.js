'use strict';
(function(){

angular.module('appb')
.component('appbFeedInput',{
  templateUrl: 'modules/feed/appb-feed-input.component.template.html',  
  bindings: { 
    appData:"<",
    //pics 用单向绑定，外部变化能自动调用$onChange
    pics:"<",
    feedApp:"<",
    feedCat:"<",
    feedData:"=" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      

      ctrl.maxTextLength=999;
      
      ctrl.updateImg=function(imgs) {
        var fcat= ctrl.feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
        var drft= ctrl.feedData.draftAll[fcat];
        $log.log('drft==->',drft);
        if(!drft)return;//未初始化完成草稿（http未返回）
        drft.pics=imgs.join(',');
        ctrl.feedData.changeMark('pics');
      }
      ctrl.$onInit=function(){
        ctrl.fconfig=ctrl.feedData.getFeedDefinition(ctrl.feedApp,ctrl.feedCat);
        $log.log('feed-input feedData:',ctrl.feedData);
        intervalRes=$interval(function(){ctrl.feedData.updateData(ctrl.feedApp,ctrl.feedCat)},15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){
        if( chg.pics) {
          if(ctrl.pics)ctrl.imgs=ctrl.pics.split(',');
          else ctrl.imgs=[];
        }

      }
      ctrl.$onDestroy=function(){
        $interval.cancel(intervalRes);
        ctrl.feedData.updateData(ctrl.feedApp,ctrl.feedCat);
      }

      
      
      
      
      
    }
  ]
})


//___________________________________
})();
