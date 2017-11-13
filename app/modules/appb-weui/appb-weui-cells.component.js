'use strict';
(function(){

angular.module('appb')
.component('appbWeuiCells',{
    templateUrl: 'modules/appb-weui/appb-weui-cells.component.template.html',  
    bindings: {
      title: "@",
      cells: '<'
    },
    controller: ['$log','$location','AppbData',
      function ($log,$location,AppbData){
        var ctrl=this;
        
        ctrl.$onInit=function() {
        }
        ctrl.goLink =AppbData.getAppData().goLink;
      }
    ]
})



  
//______________________________
})();
