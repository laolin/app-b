'use strict';
(function(){

angular.module('appb')
.component('appbWeuiTabs',{
    templateUrl: 'modules/appb-ui/appb-weui-tabs.component.template.html',  
    bindings: {
      tabs: '<'
    },
    controller: ['$scope','$log','$timeout','$location',
      function ($scope,$log,$timeout,$location){
        var ctrl=this;
        
        ctrl.$onInit=function() {
        }
        ctrl.goLink=function(a,index) {
          for(var i=ctrl.tabs.length;i--;) {
            ctrl.tabs[i]['active']= i==index;
          }
          if(a) {
            if(typeof a == 'function') {
              a(index);
            } else {
              $location.url(a);
            }
          }
        }//end ctrl.goLink
      }
    ]
})



  
//______________________________
})();
