'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-edit', {
    templateUrl: 'app-steefac/fac-add/fac-edit.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','FacMap','FacApi','FacUser',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,FacMap,FacApi,FacUser) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/my'});;
        }
        if(!FacUser.isAdmin()) {
          return $location.path( '/my');;
        }
        var addrInput_bak={};
        var mapCenter_bak,mapZoom_bak,pos_bak;
        
        AppbData.activeHeader('home', '修改钢构厂'); 
        var search=$location.search();
        var id=parseInt(search.id);
        FacApi.callApi('steefac','detail',{id:id}).then(function(s){
          $log.log('detail',s);
          if(!s) {
            $scope.models={};
            $scope.noData=true;
            return;
          }
          FacDefine.formatObj(s);
          angular.extend($scope.models,s);
          FacMap.selPositionStart('cube','',new AMap.LngLat(s.lngE7/1e7,s.latE7/1e7));

        });

        
        $scope.$on('$viewContentLoaded', function () {
          $scope.models=FacMap.addrInput;
        });
        $scope.$on('$destroy', function () {
          FacMap.selPositionEnd();
        });

        
        $scope.formDefine=FacDefine;
        $scope.models={};
        $scope.onDelete=function(){
          appData.dialogData.confirmDialog('删除【'+$scope.models.id+'】',_doDel)
        }
        function _doDel() {
          $log.log('/fac-Del .onOk');
          FacApi.callApi('steefac','delete',{id:id})
          .then(function(s){
            if(s) {
              appData.toastMsg('数据已删除',2);
              $location.path( "/search" )
              
            } else {
              appData.toastMsg('删除异常',8);
            }
            $log.log('sec',s);
          },function(e){
            appData.toastMsg(e,8);//'删除失败'+
            $log.log('err',e);
          });
        }
        $scope.onUpdate=function(){
          $log.log('/fac-edit .onOk');
          FacApi.callApi('steefac','update',{id:id,d:JSON.stringify(FacMap.addrInput)})
          .then(function(s){
            appData.toastMsg('数据已成功更新',2);
            $log.log('sec',s);
          },function(e){
            appData.toastMsg(e,8);//'更新失败'+
            $log.log('err',e);
          });
        }

      }
	]
  });
}]);
