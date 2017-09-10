'use strict';

angular.module('steefac')
.component('facAddForm',{
  templateUrl: 'app-steefac/fac-add/fac-add-form.component.template.html',
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
