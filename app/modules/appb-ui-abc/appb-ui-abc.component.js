'use strict';
(function(){

angular.module('appb')
.component('appbUiAbc',{
    templateUrl: 'modules/appb-ui-abc/appb-ui-abc.component.template.html',  
    bindings: { 
      appData:"="
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
