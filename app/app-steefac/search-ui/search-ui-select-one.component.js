'use strict';

angular.module('steefac')
.component('searchUiSelectOne',{
  templateUrl: 'app-steefac/search-ui/search-ui-select-one.component.template.html',
  bindings: {
    searchType: '<',
    searchData: '<',
    objectSelected: '<'
  },
  controller:['$http','$log','$timeout',
	function ($http,$log,$timeout) {
    var ctrl=this;
    
    ctrl.$onInit=function(){
      
      ctrl.distSearch='1';
    }
    ctrl.$onChanges=function(chg){
      if(1) {
        
      }
    }// end onChanges

    
    ctrl.level=['特级','一级','二级','三级'];
    ctrl.distText=['50公里','100公里','200公里','300公里','500公里'];
    ctrl.distValue=[50,100,200,300,500];

  }]
});
