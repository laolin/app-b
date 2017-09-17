'use strict';
(function(){

angular.module('appb')
.component('appbWeuiPagination',{
    templateUrl: 'modules/appb-weui/appb-weui-pagination.component.template.html',  
    bindings: {
      pgData: '<'
    },
    controller: ['$scope','$log','$timeout','$location',
      function ($scope,$log,$timeout,$location){
        var ctrl=this;
        ctrl.pgData={};
        ctrl.$onInit=function() {
        }
        ctrl.$onChanges=function(chg){

          if(chg.pgData){
            ctrl.pgData.first='<<';
            ctrl.pgData.prev='<';
            ctrl.pgData.next='>';
            ctrl.pgData.last='>>';
          }
        }
      }
    ]
})



  
//______________________________
})();
