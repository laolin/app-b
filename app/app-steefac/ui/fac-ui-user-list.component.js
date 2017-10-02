'use strict';

angular.module('steefac')
.component('facUiUserList',{
  templateUrl: 'app-steefac/ui/fac-ui-user-list.component.template.html',
  bindings: {
    title:'<',
    usersInfo: "<",
    links: "<",
    uids: '<'
  },
  controller:['$scope','$location','$log','$interval',
	function ($scope,$location,$log,$interval) {
    var ctrl=this;
    ctrl.goLink=function(a) {
      if(typeof a == 'function') return a();
      if(a)$location.url(a);
    }
  }]
});
