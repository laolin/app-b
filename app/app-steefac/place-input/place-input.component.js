'use strict';

angular.module('steefac')
.component('placeInput',{
  templateUrl: 'app-steefac/place-input/place-input.component.template.html',
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
