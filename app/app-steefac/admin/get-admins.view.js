'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/get-admins', {
templateUrl: 'app-steefac/admin/get-admins.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacDefine','FacApi','FacUser',
function ($scope,$http,$log,$location,
  AppbData,FacDefine,FacApi,FacUser) {
  var userData=AppbData.getUserData();
  if(! userData || !userData.token) {
    return $location.path( "/wx-login" ).search({pageTo: '/my'});;
  }

  AppbData.activeHeader('home', '钢构厂管理员列表'); 
  
  $scope.FacUser=FacUser;
  $scope.isLoading=1;
  $scope.usersInfo=userData.usersInfo;

  FacUser.getAdmins().then(function(a){
    $scope.isLoading=0;
    //$log.log('===============getAdmins ok');
    $scope.adminLinks=[];
    for(var i=0;i<FacUser.admins.length;i++) {
      $scope.adminLinks[i]=function(){
        var j=i;
        return function(){
          $log.log('linkAdmin',i,j,FacUser.admins[j]);
        }
      }();
    }
  });

  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
