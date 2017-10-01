'use strict';

angular.module('steefac')
.component('searchUiSelectOneProj',{
  templateUrl: 'app-steefac/search-ui/search-ui-select-one-proj.component.template.html',
  bindings: {
    searchType: '<',
    searchData: '<'
  },
  controller:['$http','$log','$timeout',
	function ($http,$log,$timeout) {
    var ctrl=this;
    
    
    ctrl.$onInit=function(){

    }
    ctrl.$onChanges=function(chg){
    }// end onChanges

    
    ctrl.level=['特级','一级','二级','三级'];

  }]
});
