'use strict';

angular.module('steefac')
.component('steeFeedAdd',{
templateUrl: 'app-steefac/feed/stee-feed-add.component.template.html',
bindings: {

  type:'<',
  id:'<',
  
  nextPage:'<'
},
controller:['$log','$location','AppbData','FacSearch',
function ($log,$location,AppbData,FacSearch) {
  var ctrl=this;
  var appData=AppbData.getAppData();
  var feedData=appData.feedData;

  
  ctrl.isLoading=2;
  
  ctrl.appData=appData;
  ctrl.feedData=feedData;
  
  ctrl.feed=false;
  ctrl.det=false;
  
  ctrl.$onInit=function(){
    FacSearch.getDetail (ctrl.type,ctrl.id).then(function(s){
      ctrl.det=s;
      ctrl.isLoading--;
    },function(e){
      return appData.showInfoPage('参数错误',
        e+'(type='+ctrl.type+',id='+ctrl.id+')','/search')
    });
      
    ctrl.feedApp='steeComment',
    ctrl.feedCat=ctrl.type+ctrl.id;
    ctrl.fcat=feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
    if(!feedData.draftAll[ctrl.fcat]) {
      feedData.initDraft(ctrl.feedApp,ctrl.feedCat).then(function(){
        ctrl.feed=feedData.draftAll[ctrl.fcat];
      });
    } else {
      ctrl.feed=feedData.draftAll[ctrl.fcat];
    }
    ctrl.isLoading--;
  }
  ctrl.$onChanges=function(chg){

  }
  
  ctrl.afterPublish=function(a) {
    $location.url( ctrl.nextPage);
    if(feedData.feedAll[ctrl.fcat]&&feedData.feedAll[ctrl.fcat].length) {
      feedData.hasNewMore[ctrl.fcat]=true;
      feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat,{newMore:1});//自动刷新新帖
    }//原先没有任何feed时,跳到/explore后会自己取，故不需要刷新新帖
  }
  
  
}]
});
