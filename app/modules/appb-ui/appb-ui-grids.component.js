'use strict';

angular.module('appb')
.component('appbUiGrids',{
  templateUrl: 'modules/appb-ui/appb-ui-grids.component.template.html',
  bindings: {
    gridsData:"<",
    title:"<",
  },
  controller:['$log','AppbData',
	function ($log,AppbData) {
    var ctrl=this;
    var appData=AppbData.getAppData();
    ctrl.goLink = appData.goLink;
    ctrl.$onInit=function(){
      $log.log('gridsData=====',ctrl.gridsData);
    }
  }]
});
