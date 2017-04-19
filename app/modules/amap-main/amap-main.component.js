'use strict';
(function(){

angular.module('amap-main')
.component('amapMain',{
    template: 'Map Loading...',  
    bindings: {

    
    },
    controller: ['$scope','$log','$timeout','$element','AmapMainData',
      function ($scope,$log,$timeout,$element,AmapMainData){
        var ctrl=this;
        var markData;
        
        AmapMainData.showMapTo($element[0]);
        
        ctrl.$onInit=function() {
        }

          
      }
    ]
})

})();
