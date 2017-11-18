'use strict';

angular.module('appb')
.component('appbUiGrid',{
  templateUrl: 'modules/appb-ui/appb-ui-grid.component.template.html',
  bindings: {
    img:"<",
    text:"<",
    h:"<",
  },
  controller:['$log',
	function ($log) {
    var ctrl=this;
    
    ctrl.$onInit=function(){
      if(!ctrl.img)ctrl.img='../assets/img/anonymous.png';
      if(!ctrl.text)ctrl.text='未命名';
      
    }
    
    
  }]
});
