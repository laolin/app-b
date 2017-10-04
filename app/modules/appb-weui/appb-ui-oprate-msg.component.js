'use strict';
(function(){

angular.module('appb')
.component('appbUiOprateMsg',{
    templateUrl: 'modules/appb-weui/appb-ui-oprate-msg.component.template.html',  
    bindings: { 
      type: '@',
      title: "@",
      content: "@",
      btn1: "@",
      fn1: "&",
      btn2: "@",
      fn2: "&"
    },
    controller: ['$scope','$log','$location',
      function ($scope,$log,$location){
        
        var ctrl=this;
        ctrl.$onInit=function(){
          if(ctrl.type !='success') ctrl.type='warn';
          if(!ctrl.title)ctrl.title= ctrl.type=='warn'?'操作失败':'操作成功';
          if(!ctrl.btn1){
            ctrl.btn1='确定';
            ctrl.fn1=function(){$location.path('/')}
          }
        }
        
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
