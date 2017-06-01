'use strict';
(function(){

angular.module('appb')
.component('appbUiPanelCellSmall',{
    templateUrl: 'modules/appb-ui/appb-ui-panel-cell-small.component.template.html',  
    bindings: {
      text: '@',
      url: '@',
      icon: '@'
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
