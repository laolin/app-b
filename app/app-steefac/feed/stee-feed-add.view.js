'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/stee-feed-add', {
  pageTitle: "讨论区",
templateUrl: 'app-steefac/feed/stee-feed-add.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacSearch','FacUser','FacDefine',
function ($scope,$http,$log,$location,
  AppbData,FacSearch,FacUser,FacDefine) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();

  var search=$location.search();
  $scope.id=parseInt(search.id);
  $scope.type=search.type;
  
  $scope.isLoading=1;
  
  
  //$scope.nextPage="/stee-feed-show?type="+$scope.type+"&id="  + $scope.id;
  $scope.nextPage = $scope.type=='steefac'
    && "/fac-detail/" + $scope.id + "?tabIndex=3"
    || "/project-detail/" + $scope.id + "?tabIndex=2";
  
  FacSearch.getDetail ($scope.type,$scope.id).then(function(s){
    $scope.fac=s;
    $scope.isLoading--;
    appData.setPageTitleAndWxShareTitle(s.name+'的讨论区');
    
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
