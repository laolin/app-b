'use strict';
(function(){

angular.module('appb')
.component('appbWeuiInput',{
  templateUrl: 'modules/appb-weui/appb-weui-input.component.template.html',  
  bindings: { 
    models:"<",
    formDefine:"<",
  },
  controller: ['$log','$timeout',
    function ($log,$timeout){
      var ctrl=this;
      ctrl.formName='fawi'+(+new Date);

      
      
      
    }
  ]
})


//___________________________________
})();
