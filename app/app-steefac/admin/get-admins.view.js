'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/get-admins', {
templateUrl: 'app-steefac/admin/get-admins.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacDefine','FacUser','FacSearch',
function ($scope,$http,$log,$location,
  AppbData,FacDefine,FacUser,FacSearch) {
  var userData=AppbData.getUserData();
  if(! userData || !userData.token) {
    return $location.path( "/wx-login" ).search({pageTo: '/my'});;
  }

  var namesOfAdmin={
    steefac:"钢构厂管理员",
    steeproj:"采购商列表",
  }
  var search=$location.search();
  var objType=search.type;
  
  if(!FacSearch.isTypeValid(objType)) {
    return appData.showInfoPage('类型错误','E:type:'+objType,'/my');
  }

  $scope.FacUser=FacUser;
  $scope.isLoading=1;
  $scope.title=namesOfAdmin[objType]+'列表';
  $scope.typeAdmins=[];
  appData.setPageTitle($scope.title); 
  

  
  FacUser.getAdmins().then(function(a){
    $scope.isLoading=0;
    //$log.log('===============getAdmins ok',a);
    $scope.adminLinks=[];
    for(var i=0,j=0;i<FacUser.admins.length;i++) {
      if(FacUser.admins[i][objType+'_can_admin']) {
        $scope.typeAdmins[j]=FacUser.admins[i];
        $scope.adminLinks[j]='/get-facs-of-admin?aid='+i+'&uid='+FacUser.admins[i].uid;
        j++;
      }
    }
  },function(e){
    $scope.isLoading=0;
    $scope.err=e;
  });

  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

        
        

}]

});
}]);
