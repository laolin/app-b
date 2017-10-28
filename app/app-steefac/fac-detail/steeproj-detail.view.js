'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/steeproj-detail', {
templateUrl: 'app-steefac/fac-detail/steeproj-detail.view.template.html',
  controller: ['$scope','$http','$log','$location',
    'AppbData','FacDefine','FacSearch','FacUser',
  function mzUserSearchCtrl($scope,$http,$log,$location,
    AppbData,FacDefine,FacSearch,FacUser) {
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }

    appData.setPageTitle('用钢项目详情'); 
    
    var search=$location.search();
    var id=parseInt(search.id);
    
    $scope.isLoading=1;
    $scope.user=FacUser;
    $scope.fac={};
    $scope.id=id;

    
    FacSearch.getDetail('steeproj',id).then(function(s){
      if(!s) {
        return appData.showInfoPage('参数错误','Err id: '+id,'/search')
      }
      $scope.isLoading=0;
      appData.setPageTitle(s.name);
      $scope.fac=s;
      var omonth={3:'三月内',6:'六月内',12:'一年内',24:'两年内',60:'五年内'}

      s.in_month_t=omonth[s.in_month]

      
    });

    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$destroy', function () {
    });

        
        

  }]

});
}]);
