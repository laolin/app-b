'use strict';
(function(){

angular.module('appb')
.component('appbUiFooter',{
    templateUrl: 'modules/appb-ui/appb-ui-footer.template.html',  
    bindings: {
      footerData: '='
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){

      }
    ]
})



  
//______________________________
})();
