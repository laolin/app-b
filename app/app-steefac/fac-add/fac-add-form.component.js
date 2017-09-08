'use strict';

angular.module('steefac')
.component('facAddForm',{
  templateUrl: 'app-steefac/fac-add/fac-add-form.component.template.html',
  bindings: {
    searchData: '='
  },
  controller:['$scope','$http','$log','$interval','FacMap',
	  function ($scope,$http,$log,$interval,FacMap) {
      $scope.facAddr=FacMap.facAddr;
      
    }
  ]
});
