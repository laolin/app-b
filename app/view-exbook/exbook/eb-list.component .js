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
      
      

      
      
      
    }
  ]
})


//___________________________________
})();
