'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/stee-feed-add', {
templateUrl: 'app-steefac/feed/stee-feed-add.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacSearch','FacApi','FacUser','FacDefine',
function ($scope,$http,$log,$location,
  AppbData,FacSearch,FacApi,FacUser,FacDefine) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();
        
  appData.setPageTitle('讨论区');

  var search=$location.search();
  $scope.id=parseInt(search.id);
  $scope.type=search.type;
  
  $scope.isLoading=1;
  
  
  $scope.nextPage="/stee-feed-show?type="+$scope.type+"&id="  + $scope.id;
  
  FacSearch.getDetail ($scope.type,$scope.id).then(function(s){
    $scope.fac=s;
    $scope.isLoading--;
    appData.setPageTitle(s.name+'的讨论区');
    
  },function(e){
    return appData.showInfoPage('参数错误',
      e+'(type='+$scope.type+',id='+$scope.id+')','/search')
  })
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
