'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/get-facs-of-admin', {
  pageTitle: "管理的钢构厂",
templateUrl: 'app-steefac/admin/get-facs-of-admin.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacDefine','FacUser','FacSearch',
function ($scope,$http,$log,$location,
  AppbData,FacDefine,FacUser,FacSearch) {
  var userData=AppbData.getUserData();
  if(! userData || !userData.token) {
    return $location.path( "/wx-login" ).search({pageTo: '/my'});;
  }

  $scope.isLoading=1;
  $scope.facIds=[];
  $scope.objTypes=FacSearch.objTypes;
  $scope.objNames=FacSearch.objNames;

  var search=$location.search();
  var uid=parseInt(search.uid);
  var aid=parseInt(search.aid);
  
  userData.requireUsersInfo([{uid:uid}]).then(function(){
    $scope.user=userData.usersInfo[uid];
    if(!$scope.user)  $scope.err='error uid/aid:'+uid+'/'+aid;
  });
  
  FacUser.getAdmins().then(function(admins){
    var user = admins.find( item => item.uid == uid);
    if(user) {
      for(var type  of $scope.objTypes) {
        $scope.facIds[type] = user[type + '_can_admin'];
      }
      $scope.isLoading=0;
      $log.log('$scope.facIds/uid,aid:',uid,aid,$scope.facIds);
    } else {
      $log.log('err uid,aid:',uid,aid);
      $scope.err='error uid/aid:'+uid+'/'+aid;
      $scope.isLoading=0;
    }
  },function(e){
    $scope.isLoading=0;
    $scope.err=e;
  });
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
