'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/case-add', {
templateUrl: 'app-steefac/case/case-add.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacSearch','FacApi','FacUser','AppbFeedService',
function ($scope,$http,$log,$location,
  AppbData,FacSearch,FacApi,FacUser,AppbFeedService) {
  var appData=AppbData.getAppData();
        
  appData.setPageTitle('钢构厂业绩');

  var search=$location.search();
  $scope.id=parseInt(search.id);
  $scope.isLoading=1;
  
  if(!$scope.id) {
    return appData.showInfoPage('参数错误','Err id: '+$scope.id,'/search')
  }
  //==================
  $scope.title='钢构厂业绩';
  $scope.feedApp='steeFacCase';
  $scope.feedCat='fac_case_'+$scope.id;
  
  $scope.nextPage="/case-show?id="  + $scope.id;

  FacSearch.getDetail('steefac',$scope.id).then(function(s){
    $scope.isLoading=0;
    if(!s) {
      return appData.showInfoPage('参数错误','Err id: '+$scope.id,'/search')
    }
    //$scope.det=s;
    $scope.title=s.name + '的业绩';
  },function(e){
    return appData.showInfoPage('发生错误',e+', id:'+$scope.id,'/search')
  });


  


  
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
