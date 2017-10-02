'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/fac-detail', {
templateUrl: 'app-steefac/fac-detail/fac-detail.template.html',
  controller: ['$scope','$http','$log','$location',
    'AppbData','FacDefine','FacMap','FacApi','FacUser',
  function ($scope,$http,$log,$location,
    AppbData,FacDefine,FacMap,FacApi,FacUser) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }

    AppbData.activeHeader('home', '钢构厂详情'); 
    
    var search=$location.search();
    var id=parseInt(search.id);
    
    $scope.detail={obj:0,init:0};
    $scope.FacUser=FacUser;
    $scope.fac={};
    $scope.id=id;

    
    FacApi.callApi('steefac','detail',{id:id}).then(function(s){
      $log.log('detail',s);
      if(!s) {
        $location.path( "/" );
        return;
      }
      FacDefine.formatObj(s);
      $scope.detail.obj=s;
      $scope.fac=s;
      $scope.detail.init= + new Date;
      
      $scope.goodat=[];
      s.goodat.split(',').forEach(function(val,ind){
        $scope.goodat[ind]={text:val,icon:'check-circle'};
      });
      _get_admin_of_fac();
    })
    function _get_admin_of_fac(){
      FacApi.callApi('stee_user','get_admin_of_fac',{facid:id}).then(function(s){
        $log.log('get_admin_of_fac',s);
        if(s) {
          var uids=[];
          for(var i=s.length;i--; ) {
            uids.push({uid:s[i].uid});
          }
          userData.requireUsersInfo(uids).then(function(){
            $scope.uids=uids;
            $scope.usersInfo=userData.usersInfo;          
          });
        }
      });
    }

    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$destroy', function () {
    });

        
        

  }]

});
}]);
