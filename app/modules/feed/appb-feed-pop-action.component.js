'use strict';
(function(){

angular.module('appb')
.component('appbFeedPopAction',{
  templateUrl: 'modules/feed/appb-feed-pop-action.component.template.html',  
  bindings: { 
    fid:"<",
    liking:"<",
    cmtData:"<",

    appData:"<"
  },
  controller: ['$log','$timeout','$location',
    function ($log,$timeout,$location){
      var ctrl=this;
      
      ctrl.$onInit=function(){
      }
      ctrl.$onChanges =function(chg){
      }
      ctrl.$onDestroy=function(){
      }
      ctrl.like=function(){
        $log.log('like fid=',ctrl.fid);
        if(ctrl.liking) {
          ctrl.cmtData.delLike(ctrl.fid,ctrl.liking);
        } else {
          ctrl.cmtData.addLike(ctrl.fid);
        }
      }
      ctrl.comment=function($event) {
        //$event.stopPropagation(); 不能停止向上传递消息，否则弹出框不会关闭
        ctrl.appData.inputData.showBar({
          type:'comment',
          id:ctrl.fid,
          re_cid:0,
          re_uid:0,
          placeholder:'',
          onOk:ctrl.cmtData.addComment
        });
      }
    }
  ]
})


//___________________________________
})();
