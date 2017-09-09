'use strict';

angular.module('steefac')
.component('facAddrInput',{
  templateUrl: 'app-steefac/fac-add/fac-addr-input.component.template.html',
  bindings: {
  },
  controller:['$http','$log','$interval','AppbData','FacMap',
	  function ($http,$log,$interval,AppbData,FacMap) {
      
      var appData=AppbData.getAppData();

      var ctrl=this;
      ctrl.searchAddr = function() {
        FacMap.searchAddr(ctrl.facAddr.addr);
      }
      ctrl.facAddr=FacMap.facAddr;
      ctrl.FacMap=FacMap;
    }
  ]
});
