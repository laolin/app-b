'use strict';

angular.module('steefac')
.component('facSearchOptions',{
  templateUrl: 'app-steefac/search/search-options.component.template.html',
  bindings: {
    searchData: '='
  },
  controller:['$scope','$http','$log','$interval',
	function ($scope,$http,$log,$interval) {
      $scope.$ctrl.specialValue={
         "id": "12345",
         "value": "green"
      };
    }
  ]
});
