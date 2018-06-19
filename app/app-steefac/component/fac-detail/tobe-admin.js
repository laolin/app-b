/**
 * 成为管理员
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('tobeAdmin',{
    template: `
    <div class="btn-box box-primary" ng-if="ac=='apply'" ng-click="toApply()">申请成为管理员</div>
    <img ng-src="{{FacUser.myData.wx.headimgurl}}" class="rem rem-20" ng-if="ac=='admin' || ac=='superAdmin'" ng-click="toAdmin()"></img>
    `,
    bindings: {
      type: '<',
      adminInfo: '<',
      fac: '<',
    },
    controller:['$scope', '$element', 'FacUser', 'AppbData', tobeAdmin]
  });


  function tobeAdmin($scope, $element, FacUser, AppbData) {
    $scope.ac ='admin';
    $scope.FacUser = FacUser;
    this.$onChanges = (chg) => {
      if(this.adminInfo){
        $scope.ac =
          this.adminInfo.count == 0 && 'apply' ||
          FacUser.isSysAdmin()      && 'superAdmin' ||
          this.adminInfo.me         && 'admin' ||
          '' ;
      }
    }
    $scope.toApply = ()=>{
      FacUser.applyAdmin(this.type || 'steefac',this.fac);
    }
    $scope.toAdmin = ()=>{
      var uids = this.adminInfo && this.adminInfo.admins && this.adminInfo.admins.map( item => {
        return {uid: item.uid}
      }) || [];
      let userData = AppbData.getUserData();
      userData.requireUsersInfo(uids).then(() => {
        $scope.$emit("show-admin-list", {
          uids: uids,
          usersInfo: userData.usersInfo,
        });
      });
    }
  }
})(window, angular);