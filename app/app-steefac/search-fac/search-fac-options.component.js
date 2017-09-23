'use strict';

angular.module('steefac')
.component('searchFacOptions',{
  templateUrl: 'app-steefac/search-fac/search-fac-options.component.template.html',
  bindings: {
    searchData: '='
  },
  controller:['$http','$log','$interval',
	function ($http,$log,$interval) {
    
  }]
});
