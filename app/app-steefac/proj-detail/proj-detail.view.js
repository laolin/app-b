'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/proj-detail', {
templateUrl: 'app-steefac/proj-detail/proj-detail.view.template.html',
  controller: ['$scope','$http','$log','$location',
    'AppbData','FacDefine','FacMap','FacApi','FacUser',
  function mzUserSearchCtrl($scope,$http,$log,$location,
    AppbData,FacDefine,FacMap,FacApi,FacUser) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }

    AppbData.activeHeader('home', '用钢项目详情'); 
    
    var search=$location.search();
    var id=parseInt(search.id);
    
    $scope.detail={obj:0,init:0};
    $scope.user=FacUser;
    $scope.fac={};
    $scope.id=id;

    
    FacApi.callApi('steeproj','detail',{id:id}).then(function(s){
      $log.log('detail',s);
      FacDefine.formatObj(s);
      $scope.detail.obj=s;
      $scope.fac=s;
      var omonth={3:'三月内',6:'六月内',12:'一年内',24:'两年内',60:'五年内'}

      s.in_month_t=omonth[s.in_month]
      $scope.detail.init= + new Date;

      
    });

    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$destroy', function () {
    });

        
        

  }]

});
}]);
