'use strict';

angular.module('steefac')
.component('facUiUserList',{
  templateUrl: 'app-steefac/ui/fac-ui-user-list.component.template.html',
  bindings: {
    usersInfo: "<",
    uids: '<'
  },
  controller:['$scope','$http','$log','$interval',
	function ($scope,$http,$log,$interval) {
    
  }]
});
