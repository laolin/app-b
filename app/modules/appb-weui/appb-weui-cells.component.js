'use strict';
(function(){

angular.module('appb')
.component('appbWeuiCells',{
    templateUrl: 'modules/appb-weui/appb-weui-cells.component.template.html',  
    bindings: {
      title: "@",
      cells: '<'
    },
    controller: ['$scope','$log','$timeout','$location',
      function ($scope,$log,$timeout,$location){
        var ctrl=this;
        
        ctrl.$onInit=function() {
        }
        ctrl.goLink=function(a) {
          if(typeof a == 'function') return a();
          if(a)$location.url(a);
        }
      }
    ]
})



  
//______________________________
})();
