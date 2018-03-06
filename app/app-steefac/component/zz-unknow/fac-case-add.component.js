'use strict';

angular.module('steefac')
.component('facCaseAdd',{
templateUrl: 'app-steefac/component/zz-unknow/fac-case-add.component.template.html',
bindings: {

  feedApp:'<',
  feedCat:'<',
  
  nextPage:'<',
  facId:'<',
},
controller:['$log','$location','AppbData','SIGN',
function ($log,$location,AppbData,SIGN) {
  var ctrl=this;
  var appData=AppbData.getAppData();
  var feedData=appData.feedData;

  
  ctrl.isLoading=1;
  
  ctrl.appData=appData;
  ctrl.feedData=feedData;
  
  ctrl.feed=false;
  ctrl.det=false;
  
  ctrl.$onInit=function(){
    ctrl.fcat=feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
    if(!feedData.draftAll[ctrl.fcat]) {
      feedData.initDraft(ctrl.feedApp,ctrl.feedCat).then(function(){
        ctrl.feed=feedData.draftAll[ctrl.fcat];
      });
    } else {
      ctrl.feed=feedData.draftAll[ctrl.fcat];
    }
    ctrl.isLoading=0;
  }
  ctrl.$onChanges=function(chg){

  }
  
  ctrl.afterPublish=function(a) {
    
    $location.url( ctrl.nextPage);
    if(feedData.feedAll[ctrl.fcat]&&feedData.feedAll[ctrl.fcat].length) {
      feedData.hasNewMore[ctrl.fcat]=true;
      feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat,{newMore:1});//自动刷新新帖
    }//原先没有任何feed时,跳到/explore后会自己取，故不需要刷新新帖
    SIGN.post('steeobj','flush_time',
    {type:'steefac',id:ctrl.facId});
  }
  
  
}]
});
