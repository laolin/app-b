'use strict';
(function(){

angular.module('appb')
.component('appbUiToast',{
    templateUrl: 'modules/appb-ui/appb-ui-toast.component.template.html',  
    bindings: { 
      toast: "="
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){
        var ctrl=this;
        ctrl.$onInit=function(){
        }
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
