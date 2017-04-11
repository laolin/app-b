'use strict';
(function(){

angular.module('appb')
.component('appbUiPopmenu',{
    templateUrl: 'modules/appb-ui/appb-ui-popmenu.component.template.html',  
    bindings: { 
      menus:"<",
      modal: "<",
      show: "="
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){
        var ctrl=this;
        ctrl.click=function(i) {
          if( typeof ctrl.menus[i].onClick == 'function')ctrl.menus[i].onClick()
          ctrl.show=false;
        }
        ctrl.clickOut=function() {
          if(!ctrl.modal)ctrl.show=false;
        }
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
