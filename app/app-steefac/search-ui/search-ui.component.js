'use strict';

angular.module('steefac')
.component('searchUi',{
  templateUrl: 'app-steefac/search-ui/search-ui.component.template.html',
  bindings: {
    searchType:'<',
    searchData: '='
  },
  controller:['$http','$log','$interval',
	function ($http,$log,$interval) {
    
  }]
});
