'use strict';
(function(){

angular.module('appb')
.component('appbWeuiForm',{
  templateUrl: 'modules/appb-weui/appb-weui-form.component.template.html',  
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
