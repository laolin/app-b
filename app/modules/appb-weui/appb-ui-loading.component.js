'use strict';
(function(){

angular.module('appb')
.component('appbUiLoading',{
    templateUrl: 'modules/appb-weui/appb-ui-loading.component.template.html',  
    bindings: {
      text: '@'
    },
    controller: ['$scope','$log','$timeout','$element',
      function ($scope,$log,$timeout,$element){
        var ctrl=this;
        
        ctrl.$onInit=function() {
        }
      }
    ]
})



  
//______________________________
})();
