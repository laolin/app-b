'use strict';

angular.module('steefac')
.component('facAddrInput',{
  templateUrl: 'app-steefac/fac-add/fac-addr-input.component.template.html',
  bindings: {
    searchData: '='
  },
  controller:['$scope','$http','$log','$interval','AppbData','FacMap',
	  function ($scope,$http,$log,$interval,AppbData,FacMap) {
      
      var appData=AppbData.getAppData();

      $scope.searchAddr = function() {
        FacMap.searchAddr($scope.searchText);
      }
      $scope.facAddr=FacMap.facAddr;
    }
  ]
});
