'use strict';

angular.module('appb')
.component('appbUiRect',{
  templateUrl: 'modules/appb-ui/appb-ui-rect.component.template.html',
  bindings: {
    img:"<",
  },
  controller:['$log',
	function ($log) {
    var ctrl=this;
    
    ctrl.$onInit=function(){
    }
    
    
  }]
});
