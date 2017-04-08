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
