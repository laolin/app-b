'use strict';
(function(){

angular.module('exbook')
.component('ebList',{
  templateUrl: 'view-exbook/exbook/eb-list.component.template.html',  
  bindings: { 
    ebData:"<",
    appData:"<"
  },
  controller: ['$log','$timeout','$interval','$scope','$document',
    function ($log,$timeout,$interval,$scope,$document){
      var ctrl=this;
      
      ctrl.$onInit=function(){
      }
      ctrl.$onChanges =function(chg){
      }
      ctrl.$onDestroy=function(){
      }
      ctrl.clickImg=function(f,n){
        $log.log('ctrl.clickImg',f,n);
        ctrl.appData.showGallery(ctrl.ebData.feedList[f].pics.split(','),n);
      }
      
      

      ctrl.activeAction=-2;
      ctrl.amILiking={}
      
      //动态计算是否点过赞
      ctrl.isLiked=function(fid){
        var likes=ctrl.ebData.cmtData.commentList[fid+'like'];
        if(!likes)return ctrl.amILiking[fid]=false;
        for(var i=likes.length;i--; ) {
          if(ctrl.appData.userData.uid==likes[i].uid)
            return ctrl.amILiking[fid]=likes[i].cid;
        }
        return ctrl.amILiking[fid]=false;
      }

      
      
      ctrl.hidePop=function(){
        //$log.log('off-str=',ctrl.activeAction);
        ctrl.activeAction=-1;
        $timeout(function(){
          //$log.log('off-timer=',ctrl.activeAction);
          //不运行个timeout,scope不更新，不知道为什么
        },2);
        $document
          .off('ontouchend', ctrl.hidePop)
          .off('click', ctrl.hidePop);
        //$log.log('off-ed=',ctrl.activeAction);
      }
      ctrl.showPop=function(n,$event){
        $event.stopPropagation();
        ctrl.isLiked(ctrl.ebData.feedList[n].fid);//需要动态计算，因为可能在显示后点过赞
        if(ctrl.activeAction==n){
          ctrl.hidePop();
        } else {
          ctrl.activeAction=n;
          $document
            .on('ontouchend', ctrl.hidePop)
            .on('click', ctrl.hidePop);
        }
      }
      
    }
  ]
})


//___________________________________
})();
