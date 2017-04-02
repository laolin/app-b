'use strict';
(function(){

angular.module('exbook')
.component('ebList',{
  templateUrl: 'view-exbook/exbook/eb-list.component.template.html',  
  bindings: { 
    ebData:"<",
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
      ctrl.clickImg=function(f,n){
        $log.log('ctrl.clickImg',f,n);
        ctrl.appData.showGallery(ctrl.ebData.feedList[f].pics.split(','),n);
      }      
      
    }
  ]
})


//___________________________________
})();
