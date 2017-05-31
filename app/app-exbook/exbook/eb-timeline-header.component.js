'use strict';
(function(){

angular.module('exbook')
.component('ebTimelineHeader',{
  templateUrl: 'app-exbook/exbook/eb-timeline-header.component.template.html',  
  bindings: { 
    appData:"<",
    userData:"<" 
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
