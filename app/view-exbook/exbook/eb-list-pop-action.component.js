'use strict';
(function(){

angular.module('exbook')
.component('ebListPopAction',{
  templateUrl: 'view-exbook/exbook/eb-list-pop-action.component.template.html',  
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
        $log.log('ebListComment init',ctrl.likeData,ctrl.commentData);
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
      
    }
  ]
})


//___________________________________
})();
