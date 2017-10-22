'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/proj-edit', {
    templateUrl: 'app-steefac/proj/proj-edit.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','ProjDefine','FacMap','AppbAPI','FacUser','FacSearch',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,ProjDefine,FacMap,AppbAPI,FacUser,FacSearch) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/my'});;
        }
        if(!FacUser.isAdmin()) {
          return $location.path( '/my');;
        }
        
        appData.setPageTitle('修改用钢项目信息'); 
        var search=$location.search();
        var id=parseInt(search.id);
        FacSearch.getDetail('steeproj',id).then(function(s){
          if(!s) {
            return appData.showInfoPage('参数错误','Err id: '+id,'/search')
          }
          FacMap.selPositionStart('university','',new AMap.LngLat(s.lngE7/1e7,s.latE7/1e7));
          angular.extend($scope.models,s);
        },function(e){
          return appData.toastMsg(e,3);
        });

        
        $scope.$on('$viewContentLoaded', function () {
          $scope.models=FacMap.addrInput;
        });
        $scope.$on('$destroy', function () {
          FacMap.selPositionEnd();
        });

        
        $scope.formDefine=ProjDefine;
        $scope.models={};
        $scope.onDelete=function(){
          appData.dialogData.confirmDialog('删除【'+$scope.models.id+'】',_doDel)
        }
        function _doDel() {
          $log.log('/proj-Del .onOk');
          AppbAPI('steeproj','delete',{id:id})
          .then(function(s){
            if(s) {
              delete FacSearch.datailCache['steeproj'+id];
              appData.toastMsg('数据已删除',2);
              $location.path( "/search" )
              
            } else {
              appData.toastMsg('删除异常',3);
            }
            $log.log('sec',s);
          },function(e){
            appData.toastMsg(e,3);//'删除失败'+
            $log.log('err',e);
          });
        }
        $scope.onUpdate=function(){
          $log.log('/proj-edit .onOk');
          AppbAPI('steeproj','update',{id:id,d:JSON.stringify(FacMap.addrInput)})
          .then(function(s){
            delete FacSearch.datailCache['steeproj'+id];
            appData.toastMsg('数据已成功更新',2);
            $log.log('sec',s);
          },function(e){
            appData.toastMsg(e,3);//'更新失败'+
            $log.log('err',e);
          });
        }

      }
	]
  });
}]);
