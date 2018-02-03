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
  controller:['$scope','$location','AppbData',
	function ($scope,$location,AppbData) {
    var ctrl=this;
    var userData=AppbData.getUserData();
    var appData=AppbData.getAppData();
    ctrl.usersInfo=userData.usersInfo;
    
    ctrl.goLink=appData.goLink;
    $scope.clickItem = (item, index) => {
      if(this.links && this.links[index]){
        appData.goLink(this.links[index])
      }
      else{
        $scope.$emit('fac-ui-user-list.itemClick', {item, index});
      }
    }
  }]
});
