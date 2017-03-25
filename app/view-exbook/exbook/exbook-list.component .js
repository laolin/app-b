'use strict';
(function(){

angular.module('exbook')
.component('exbookList',{
  templateUrl: 'view-exbook/exbook/exbook-list.component.template.html',  
  bindings: { 
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
      
      
    }
  ]
})


//___________________________________
})();
