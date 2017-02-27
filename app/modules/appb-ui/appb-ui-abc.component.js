'use strict';
(function(){

angular.module('appb')
.component('appbUiAbc',{
    templateUrl: 'modules/appb-ui/appb-ui-abc.component.template.html',  
    bindings: { 
      dialogData: "="
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){
        var ctrl=this;
        ctrl.$onInit=function(){
          $log.log('dialogData in appbUiAbc',ctrl.dialogData);
        }
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
