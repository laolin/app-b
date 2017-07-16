'use strict';
(function(){

angular.module('jia')
.component('serveFeed',{
  templateUrl: 'app-jia/serve/serve-feed.component.template.html',  
  bindings: { 
    feedData:"<",
    feedApp:"<",
    feedCat:"<",
    feed:"<",
    appData:"<"
  },
  controller: ['$log','$timeout','$interval','$location','$document',
    function ($log,$timeout,$interval,$location,$document){
      var ctrl=this;
      
      ctrl.$onInit=function(){
        ctrl.admin=$location.search()['admin'];
        ctrl.canAdmin=false;
        if(ctrl.admin==1) {
          ctrl.canAdmin=ctrl.appData.userData.isAdmin();
        }        
      }
      ctrl.$onChanges =function(chg){
      }
      ctrl.$onDestroy=function(){
      }
      

      ctrl.fValue=function(name,key){
        return ctrl.feedData.getFeedDefinitionValue(ctrl.feedApp,name,key);
        
      }
      
      ctrl.clickImg=function(n){
        $log.log('ctrl.clickImg',n);
        ctrl.appData.showGallery(ctrl.feed.pics.split(','),n);
      }

      //从eb-list移植过来的，这里待优化 //TODO
      ctrl.amILiking={};
      
      //动态计算是否点过赞
      ctrl.isLiked=function(fid){
        var likes=ctrl.feedData.cmtData.commentList[fid+'like'];
        if(!likes)return ctrl.amILiking[fid]=false;
        for(var i=likes.length;i--; ) {
          if(ctrl.appData.userData.uid==likes[i].uid)
            return ctrl.amILiking[fid]=likes[i].cid;
        }
        return ctrl.amILiking[fid]=false;
      }
     
      ctrl.hidePop=function(){
        ctrl.feedData._activeAction=-1;
        $timeout(function(){ },2);// for => $scope.$apply()
        $document
          .off('ontouchend', ctrl.hidePop)
          .off('click', ctrl.hidePop);
      }
      ctrl.showPop=function(fid,$event){
        $event.stopPropagation();
        ctrl.isLiked(fid);//需要动态计算，因为可能在显示后点过赞
        if(ctrl.feedData._activeAction==fid){
          ctrl.hidePop();
        } else {
          ctrl.feedData._activeAction=fid;
          $document
            .on('ontouchend', ctrl.hidePop)
            .on('click', ctrl.hidePop);
        }
      }

      
      ctrl.pubFeed=function(pub){
        $log.log('ctrl.pubFeed',+ctrl.feed.access,pub)
        if(+ctrl.feed.access && pub) {
          ctrl.feedData.changeFeedAccess(ctrl.feedApp,ctrl.feedCat,ctrl.feed.fid,0)
          .then(function(s){
            ctrl.feed.access=0;
          },function(e){});
        }
        else if(!+ctrl.feed.access && !pub) {
          ctrl.feedData.changeFeedAccess(ctrl.feedApp,ctrl.feedCat,ctrl.feed.fid,0x10000)
          .then(function(s){
            ctrl.feed.access=0x10000;
          },function(e){});
        }
      }

      
      
      
    }
  ]
})


//___________________________________
})();
