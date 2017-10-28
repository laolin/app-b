'use strict';
(function(){

angular.module('appb')
.component('appbWeuiForm',{
  templateUrl: 'modules/appb-weui/appb-weui-form.component.template.html',  
  bindings: { 
    models:"<",
    formDefine:"<",
  },
  controller: ['$log','$scope','$timeout',
    function ($log,$scope,$timeout){
      var ctrl=this;
      ctrl.formName='fawi'+(+new Date);

      ctrl.$onInit=function(){
        $timeout(function(){
          ctrl.formDefine._formObj=$scope[ctrl.formName];
        },1000);
      }
      
      
      
    }
  ]
})


//___________________________________
})();
