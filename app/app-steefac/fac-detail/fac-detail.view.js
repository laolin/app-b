'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/fac-detail', {
templateUrl: 'app-steefac/fac-detail/fac-detail.template.html',
  controller: ['$scope','$http','$log','$location',
    'AppbData','FacDefine','FacMap','FacApi','FacUser',
  function mzUserSearchCtrl($scope,$http,$log,$location,
    AppbData,FacDefine,FacMap,FacApi,FacUser) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }

    
    var search=$location.search();
    var id=parseInt(search.id);
    
    $scope.detail={obj:0,init:0};
    $scope.user=FacUser;
    $scope.fac={};
    $scope.id=id;

    
    FacApi.callApi('steefac','detail',{id:id}).then(function(s){
      $log.log('detail',s);
      FacDefine.formatObj(s);
      $scope.detail.obj=s;
      $scope.fac=s;
      $scope.detail.init= + new Date;
      
      $scope.goodat=[];
      s.goodat.split(',').forEach(function(val,ind){
        $scope.goodat[ind]={text:val,icon:'check-circle'};
      })



    });

    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$destroy', function () {
    });

        
        

  }]

});
}]);
