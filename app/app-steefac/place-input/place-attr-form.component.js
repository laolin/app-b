'use strict';

angular.module('steefac')
.component('placeAttrForm',{
  templateUrl: 'app-steefac/place-input/place-attr-form.component.template.html',
  bindings: {
    formDefine:"<",
    models:"<"
  },
  controller:['$http','$log','$interval','FacMap',
	  function ($http,$log,$interval,FacMap) {
      var ctrl=this;
      ctrl.FacMap=FacMap;
      
    }
  ]
});
