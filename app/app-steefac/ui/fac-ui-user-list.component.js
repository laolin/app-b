'use strict';

angular.module('steefac')
.component('facUiUserList',{
  templateUrl: 'app-steefac/ui/fac-ui-user-list.component.template.html',
  bindings: {
    title:'<',
    links: "<",
    texts: "<",
    uids: '<'
  },
  controller:['$log','$location','AppbData',
	function ($log,$location,AppbData) {
    var ctrl=this;
    var userData=AppbData.getUserData();
    var appData=AppbData.getAppData();
    ctrl.usersInfo=userData.usersInfo;
    
    ctrl.goLink=appData.goLink;
  }]
});
