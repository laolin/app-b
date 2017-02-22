'use strict';
(function(){

angular.module('appb')
.component('appbUiDialog',{
    templateUrl: 'modules/appb-ui/appb-ui-dialog.component.template.html',  
    bindings: { 
      data: "="
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){
        var ctrl=this;
        ctrl.fn1=function() {
          ctrl.data.answer=1;
          ctrl.data.show=0;
          if( typeof ctrl.data.fn1 == 'function')ctrl.data.fn1()
        }
        ctrl.fn2=function() {
          ctrl.data.answer=2;
          ctrl.data.show=0;
          if( typeof ctrl.data.fn2 == 'function')ctrl.data.fn2()
        }
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
