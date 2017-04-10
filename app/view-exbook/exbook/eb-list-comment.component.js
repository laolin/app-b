'use strict';
(function(){

angular.module('exbook')
.component('ebListComment',{
  templateUrl: 'view-exbook/exbook/eb-list-comment.component.template.html',  
  bindings: { 
    fid:"<",
    commentData:"=",
    likeData:"=",
    appData:"<"
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      
      ctrl.$onInit=function(){
      }
      ctrl.$onChanges =function(chg){
      }
      ctrl.$onDestroy=function(){
      }
      ctrl.uname=function(uid){
        var u=ctrl.appData.ebData.usersInfo[uid];
        if(!u)return 'uid'+uid;
        if(u.wxinfo)return u.wxinfo.nickname;
        return u.uname;
      }
      ctrl.comment=function(re_cid,re_uid,reuname) {
        //已经在评论，点击评论只是返回（结果是评论框会关闭，不重进入回复。）
        //如果从一个评论直接关闭再马上打开一个评论，
        //在手机上会闪两下：关于键盘，再打开键盘
        if(ctrl.appData.inputData.showing)return;
        ctrl.appData.inputData.showBar({
          type:'comment',
          id:ctrl.fid,
          re_cid:re_cid,
          re_uid:re_uid,
          placeholder:'回复: '+reuname,
          onOk:ctrl.appData.ebData.cmtData.addComment
        });
      }  
      
    }
  ]
})


//___________________________________
})();
