'use strict';
(function(){

angular.module('exbook')
.component('ebListComment',{
  templateUrl: 'view-exbook/exbook/eb-list-comment.component.template.html',  
  bindings: { 
    fid:"<",
    commentData:"=",
    likeData:"=",
    feedData:"<",
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
        var u=ctrl.feedData.usersInfo[uid];
        if(!u)return 'uid'+uid;
        if(u.wxinfo)return u.wxinfo.nickname;
        return u.uname;
      }
      ctrl.comment=function(re_cid,re_uid,reuname) {
        //已经在评论，点击评论只是返回（结果是评论框会关闭，不重进入回复。）
        //如果从一个评论直接关闭再马上打开一个评论，
        //在手机上会闪两下：关于键盘，再打开键盘
        if(ctrl.appData.inputData.showing)return;
        if(ctrl.appData.userData.uid == re_uid){
          //点击自己的评论时，不是回复自己，是弹出删除菜单
          ctrl.appData.menuData.showMenu([{
            text:'删除',
            onClick:function(){ctrl.feedData.cmtData.delComment(ctrl.fid,re_cid)}
          }],0);
          return;
        }
        ctrl.appData.inputData.showBar({
          type:'comment',
          id:ctrl.fid,
          re_cid:re_cid,
          re_uid:re_uid,
          placeholder:'回复: '+reuname,
          onOk:ctrl.feedData.cmtData.addComment
        });
      }  
      
    }
  ]
})


//___________________________________
})();
