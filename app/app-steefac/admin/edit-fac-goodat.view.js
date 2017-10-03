'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/edit-fac-goodat', {
templateUrl: 'app-steefac/admin/edit-fac-goodat.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacDefine','FacApi','FacUser','FacSearch',
function ($scope,$http,$log,$location,
  AppbData,FacDefine,FacApi,FacUser,FacSearch) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();
  appData.setPageTitle('编辑擅长构件');

  $scope.isLoading=1;
  var search=$location.search();
  var id=parseInt(search.id);
  
  //==================
  
  $scope.goodatObj={};
  

  
  FacApi.callApi('steefac','detail',{id:id}).then(function(s){
    $log.log('detail',s);
    if(!s) {
      return appData.showInfoPage('参数错误','Err id: '+id,'/search')
    }
    $scope.goodatObj.goodat=s.goodat;
    $scope.isLoading=0;
  });


  
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
