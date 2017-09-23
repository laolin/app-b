'use strict';

angular.module('steefac')
.component('searchProjOptions',{
  templateUrl: 'app-steefac/search-proj/search-proj-options.component.template.html',
  bindings: {
    searchType:'<',
    searchData: '='
  },
  controller:['$http','$log','$interval',
	function ($http,$log,$interval) {
    
  }]
});
