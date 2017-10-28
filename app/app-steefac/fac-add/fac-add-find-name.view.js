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
        
        $scope.objType=$location.search().type; 
        
        if(!FacSearch.isTypeValid($scope.objType)) {
          return appData.showInfoPage('类型错误','E:type:'+objtype,'/my');
        }
        
        $scope.objName=FacSearch.objNames[$scope.objType];
        
        
        
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).
            search({pageTo: '/fac-add'});;
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
        

        appData.setPageTitle('新增'+$scope.objName); 
        

        $scope.facList=[];
        $scope.isLoading=false;
        $scope.searchDone=false;
        $scope.FacMap=FacMap;
        $scope.onChange=function(){
          $scope.searchDone=false;
        }
        $scope.onNewFac=function(){
          appData.dialogData.msgBox(
            '请您确认：您将创建的'+$scope.objName+'正式的全名为【'+
            FacMap.addrInput[$scope.objType+'name']+
            '】，创建后不能修改名字。',
            
            '准备创建'+$scope.objName,
            '确认全名','修改全名',
            function(){
              $location.path('/fac-add').search({type:$scope.objType});
            }
          );
          
        }
        $scope.onFindFac=function(){
          
          $scope.facList=[];
          $scope.searchDone=false;
          $scope.isLoading=1;
          
          AppbAPI('steeobj','search',{type:$scope.objType,s:FacMap.addrInput[$scope.objType+'name'],count:10})
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
