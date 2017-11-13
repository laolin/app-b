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
      
      //搜索周边时，不能用原来的关键字搜索。
      ctrl.searchFac=function(){
        ctrl.searchData.searchWord='';
        ctrl.searchData.startSearch('steefac');
      };
      ctrl.searchProj=function(){
        ctrl.searchData.searchWord='';
        ctrl.searchData.startSearch('steeproj');
      };
    }
    ctrl.$onChanges=function(chg){
      if(1) {
        
      }
    }// end onChanges

    
    ctrl.level=['特级','一级','二级','三级'];
  }]
});
