'use strict';
(function(){

angular.module('appb')
.component('appbUiInputBar',{
    templateUrl: 'modules/appb-ui/appb-ui-input-bar.template.html',  
    bindings: {
      appData: '<'
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){

      }
    ]
})



  
//______________________________
})();
