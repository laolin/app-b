'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-edit', {
    templateUrl: 'app-steefac/fac-add/fac-edit.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','FacMap','FacApi','FacUser','FacSearch',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,FacMap,FacApi,FacUser,FacSearch) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/my'});;
        }
        if(!FacUser.isAdmin()) {
          return $location.path( '/my');;
        }
        var addrInput_bak={};
        var mapCenter_bak,mapZoom_bak,pos_bak;
        
        appData.setPageTitle('修改钢构厂'); 
        
        $scope.isLoading=1;
        $scope.models={};
        var search=$location.search();
        var id=parseInt(search.id);
        FacSearch.getDetail('steefac',id).then(function(s){
          $scope.isLoading=0;
          if(!s) {
            $scope.models=false;
            $scope.noData=true;
            return;
          }
          for(var i=FacDefine.inputs.length;i--; ) {
            $scope.models[FacDefine.inputs[i].name]=s[FacDefine.inputs[i].name];
          }
          $scope.models.addr=s.addr;
          
          FacMap.selPositionStart('cube','',new AMap.LngLat(s.lngE7/1e7,s.latE7/1e7));

        },function(e){
          return appData.toastMsg(e,3);
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
          appData.dialogData.confirmDialog('删除【'+id+'】',_doDel)
        }
        function _doDel() {
          $log.log('/fac-Del .onOk');
          FacApi.callApi('steefac','delete',{id:id})
          .then(function(s){
            if(s) {
              delete FacSearch.datailCache['steefac'+id];
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
          $log.log('/fac-edit .onOk');
          FacApi.callApi('steefac','update',{id:id,d:JSON.stringify(FacMap.addrInput)})
          .then(function(s){
            delete FacSearch.datailCache['steefac'+id];
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
