'use strict';
(function(){

angular.module('appb')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/sys-page.info', {
templateUrl: 'modules/sys-page/sys-page.info.view.template.html',
controller: ['$scope','$log','$location','AppbData','AppbErrorInfo',
function ($scope,$log,$location,AppbData,AppbErrorInfo) {
  var appData=AppbData.getAppData();
  appData.setPageTitle('系统消息');

  var err=AppbErrorInfo.getLastInfo();
  
  $scope.type=err.type;
  $scope.title=err.title;
  $scope.content=err.content;
  $scope.contentMore=err.contentMore;
  $scope.fn1=function(){$location.path(err.nextPage)};
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });
  

}]
})
}]);

//___________________________________
})();
