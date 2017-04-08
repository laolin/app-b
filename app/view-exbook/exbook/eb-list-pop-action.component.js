'use strict';
(function(){

angular.module('exbook')
.component('ebListPopAction',{
  templateUrl: 'view-exbook/exbook/eb-list-pop-action.component.template.html',  
  bindings: { 
    fid:"<",
    commentData:"<",

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
      ctrl.like=function(){
        $log.log('like fid=',ctrl.fid);
        ctrl.commentData.addLike(ctrl.fid);
      }
      ctrl.comment=function(){
        $log.log('comment fid=',ctrl.fid);
      }
      
    }
  ]
})


//___________________________________
})();
