'use strict';

angular.module('steefac')
.component('facUiUserList',{
  templateUrl: 'app-steefac/ui/fac-ui-user-list.component.template.html',
  bindings: {
    title:'<',
    links: "<",
    uids: '<'
  },
  controller:['$log','AppbData',
	function ($log,AppbData) {
    var ctrl=this;
    var userData=AppbData.getUserData();
    ctrl.usersInfo=userData.usersInfo;
    
    ctrl.goLink=function(a) {
      if(typeof a == 'function') return a();
      if(a)$location.url(a);
    }
  }]
});
