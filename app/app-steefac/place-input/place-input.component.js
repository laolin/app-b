'use strict';

angular.module('steefac')
.component('placeInput',{
  templateUrl: 'app-steefac/place-input/place-input.component.template.html',
  bindings: {
    formDefine:"<",
    models:"<"
  },
  controller:['$http','$log','$interval',
	  function ($http,$log,$interval) {
      var ctrl=this;
      
      
    }
  ]
});
