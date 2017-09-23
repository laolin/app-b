'use strict';

angular.module('steefac')
.component('searchUiOptions',{
  templateUrl: 'app-steefac/search-ui/search-ui-options.component.template.html',
  bindings: {
    searchType:'<',
    searchData: '='
  },
  controller:['$http','$log','$interval',
	function ($http,$log,$interval) {
    
  }]
});
