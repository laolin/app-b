'use strict';

angular.module('steefac')
.component('facCaseAdd',{
templateUrl: 'app-steefac/component/fac-case-add.component.template.html',
bindings: {

  feedApp:'<',
  feedCat:'<',
  
  nextPage:'<',
  facId:'<',
},
controller:['$log','$location','AppbData','AppbAPI',
function ($log,$location,AppbData,AppbAPI) {
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
        $log.log('feed---------1',ctrl.feed);
      });
    } else {
      ctrl.feed=feedData.draftAll[ctrl.fcat];
        $log.log('feed---------2',ctrl.feed);
    }
    ctrl.isLoading=0;
  }
  ctrl.$onChanges=function(chg){

  }
  
  ctrl.afterPublish=function(a) {
    $log.log('ctrl.afterPublish-case',a);
    
    $location.url( ctrl.nextPage);
    if(feedData.feedAll[ctrl.fcat]&&feedData.feedAll[ctrl.fcat].length) {
      feedData.hasNewMore[ctrl.fcat]=true;
      feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat,{newMore:1});//自动刷新新帖
    }//原先没有任何feed时,跳到/explore后会自己取，故不需要刷新新帖
    AppbAPI('steeobj','flush_time',
    {type:'steefac',id:ctrl.facId});
  }
  
  
}]
});
