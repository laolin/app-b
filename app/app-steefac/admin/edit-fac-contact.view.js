'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/edit-fac-contact', {
  pageTitle: "编辑联系方式",
templateUrl: 'app-steefac/admin/edit-fac-contact.view.template.html',
controller: ['$scope', '$location',  'AppbData',
 function ($scope, $location,  AppbData) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();

  var search=$location.search();
  $scope.id=parseInt(search.id);
  $scope.isLoading=0;
  
  //==================

  

  


  
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
