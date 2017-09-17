'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-detail', {
    templateUrl: 'app-steefac/fac-detail/fac-detail.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','FacMap','FacApi',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,FacMap,FacApi) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/my'});;
        }

        
        var search=$location.search();
        var id=parseInt(search.id);
        
        $scope.detail={obj:0,init:0};
        
        FacApi.callApi('steefac','detail',{id:id}).then(function(s){
          $log.log('detail',s);
          FacDefine.formatObj(s);
          $scope.detail.obj=s;
          $scope.detail.init= + new Date;


        });

        $scope.$on('$viewContentLoaded', function () {
        });
        $scope.$on('$destroy', function () {
        });

        
        

      }
	]
  });
}]);
