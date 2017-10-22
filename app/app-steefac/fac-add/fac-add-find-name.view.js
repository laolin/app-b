'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-add-find-name', {
    templateUrl: 'app-steefac/fac-add/fac-add-find-name.view.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','FacMap','AppbAPI','FacUser',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,FacMap,AppbAPI,FacUser) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/fac-add'});;
        }
        //if(!FacUser.isSysAdmin()) {
        //  return $location.path( '/my');;
        //}
        // $scope.$on('$viewContentLoaded', function () {
          // FacMap.selPositionStart('header');
        // });
        // $scope.$on('$destroy', function () {
          // FacMap.selPositionEnd();
        // });
        

        appData.setPageTitle('新增钢构厂'); 
        

        $scope.facList=[];
        $scope.isLoading=false;
        $scope.searchDone=false;
        $scope.FacMap=FacMap;
        $scope.onChange=function(){
          $scope.searchDone=false;
        }
        $scope.onNewFac=function(){
          appData.dialogData.msgBox(
            '请您确认：您将创建的钢构厂名为【'+FacMap.addrInput.name+
            '】',
            '准备创建钢构厂',
            '确认','返回修改',
            function(){
              $location.path('/fac-add')
            }
          );
          
        }
        $scope.onFindFac=function(){
          
          $scope.facList=[];
          $scope.searchDone=false;
          $scope.isLoading=1;
          
          AppbAPI('steefac','search',{s:FacMap.addrInput.name,count:10})
          .then(function(s){
            $scope.searchDone=1;
            $scope.isLoading=0;
            $scope.facList=s;
            $log.log('sec',s);
          },function(e){
            appData.toastMsg('搜索失败',3);
            $log.log('err',e);
            $scope.isLoading=0;
          });
        }

      }
	]
  });
}]);
