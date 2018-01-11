'use strict';

angular.module('steefac')
.component('searchUiSelectOne',{
  templateUrl: 'app-steefac/search-ui/search-ui-select-one.component.template.html',
  bindings: {
    searchType: '<',
    objectSelected: '<'
  },
  controller:['$http','$log','$timeout','FacSearch',
	function ($http,$log,$timeout,FacSearch) {
    var ctrl=this;
    
    ctrl.$onInit=function(){
      
      //搜索周边时，不能用原来的关键字搜索。
      ctrl.searchFac=function(){
        FacSearch.searchWord='';
        FacSearch.startSearch('steefac');
      };
      ctrl.searchProj=function(){
        FacSearch.searchWord='';
        FacSearch.startSearch('steeproj');
      };
    }
    ctrl.$onChanges=function(chg){
      if(1) {
        
      }
    }// end onChanges

    ctrl.searchData=FacSearch;
    ctrl.level=['特级','一级','二级','三级'];
  }]
});
