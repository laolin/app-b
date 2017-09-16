'use strict';

angular.module('steefac')
.component('facAttrForm',{
  templateUrl: 'app-steefac/fac-add/fac-attr-form.component.template.html',
  bindings: {
    formDefine:"<",
    models:"<"
  },
  controller:['$http','$log','$interval','FacMap',
	  function ($http,$log,$interval,FacMap) {
      var ctrl=this;
      ctrl.FacMap=FacMap;
      //ctrl.formDefine=FacDefine;

      
      
      
      
      
      
      
      
      
      
    }
  ]
});
