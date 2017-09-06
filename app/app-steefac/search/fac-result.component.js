'use strict';

angular.module('steefac')
.component('facResult',{
  templateUrl: 'app-steefac/search/fac-result.component.template.html',
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
