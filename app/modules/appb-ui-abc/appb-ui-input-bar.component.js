'use strict';
(function(){

angular.module('appb')
.component('appbUiInputBar',{
    templateUrl: 'modules/appb-ui-abc/appb-ui-input-bar.template.html',  
    bindings: {
      inputData: '<'
    },
    controller: ['$scope','$log','$timeout','$element',
      function ($scope,$log,$timeout,$element){
        var ctrl=this;
        
        ctrl.$onInit=function() {
          ctrl.inputData.elementInputBar=$element[0];
        }
      }
    ]
})



  
//______________________________
})();
