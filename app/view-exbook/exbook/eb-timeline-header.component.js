'use strict';
(function(){

angular.module('exbook')
.component('ebTimelineHeader',{
  templateUrl: 'view-exbook/exbook/eb-timeline-header.component.template.html',  
  bindings: { 
    appData:"<",
    userData:"<" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      

      ctrl.dataChanged={ 
      }
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
