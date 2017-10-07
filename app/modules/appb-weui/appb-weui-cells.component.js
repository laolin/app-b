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
          if(typeof a == 'function') {
            a();
            return false;
          }
          if(a.indexOf(':')>0){
            window.location=a;
          } else if(a) {
            $location.url(a);
            return false;
          }
        }
      }
    ]
})



  
//______________________________
})();
