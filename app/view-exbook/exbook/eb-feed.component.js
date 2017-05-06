'use strict';
(function(){

angular.module('exbook')
.component('ebFeed',{
  templateUrl: 'view-exbook/exbook/eb-feed.component.template.html',  
  bindings: { 
    ebData:"<",
    feed:"=",
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
      ctrl.clickImg=function(n){
        $log.log('ctrl.clickImg',n);
        ctrl.appData.showGallery(ctrl.feed.pics.split(','),n);
      }

      //从eb-list移植过来的，这里待优化 //TODO
      ctrl.amILiking={};
      
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
        ctrl.ebData._activeAction=-1;
        $timeout(function(){ },2);// for => $scope.$apply()
        $document
          .off('ontouchend', ctrl.hidePop)
          .off('click', ctrl.hidePop);
      }
      ctrl.showPop=function(fid,$event){
        $event.stopPropagation();
        ctrl.isLiked(fid);//需要动态计算，因为可能在显示后点过赞
        if(ctrl.ebData._activeAction==fid){
          ctrl.hidePop();
        } else {
          ctrl.ebData._activeAction=fid;
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
