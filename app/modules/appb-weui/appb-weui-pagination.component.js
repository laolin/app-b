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
            ctrl.pgData.first='首页';
            ctrl.pgData.prev='前页';
            ctrl.pgData.next='后页';
            ctrl.pgData.last='末页';
          }
        }
      }
    ]
})



  
//______________________________
})();
