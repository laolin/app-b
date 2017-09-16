'use strict';

angular.module('steefac')
.component('facBody',{
  templateUrl: 'app-steefac/fac-add/fac-body.component.template.html',
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
