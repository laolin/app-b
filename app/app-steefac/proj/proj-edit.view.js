'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/proj-edit', {
    templateUrl: 'app-steefac/proj/proj-edit.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','ProjDefine','FacMap','FacApi','FacUser',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,ProjDefine,FacMap,FacApi,FacUser) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/my'});;
        }
        if(!FacUser.isAdmin()) {
          return $location.path( '/my');;
        }
        var addrInput_bak={};
        var mapCenter_bak,mapZoom_bak,pos_bak;
        
        AppbData.activeHeader('home', '修改用钢项目信息'); 
        var search=$location.search();
        var id=parseInt(search.id);
        FacApi.callApi('steeproj','detail',{id:id}).then(function(s){
          $log.log('detail',s);
          if(!s) {
            $scope.models={};
            $scope.noData=true;
            return;
          }
          ProjDefine.formatObj(s);
          angular.extend($scope.models,s);


          FacMap.getSelMarker().then(function(m){
            var pos=new AMap.LngLat(s.lngE7/1e7,s.latE7/1e7);
            pos_bak=m.getPosition();

            m.setAwesomeIcon('bolt');
            m.setLabel({content:'',offset:new AMap.Pixel(-12,-19)});
            m.setPosition(pos);
            m.show(1);

            mapCenter_bak=FacMap.mapData.map.getCenter();
            mapZoom_bak=FacMap.mapData.map.getZoom();
            FacMap.mapData.map.setZoomAndCenter(16,pos);
            FacMap.mapData.map.panBy(0,0);//不动一点点有时显示不出来 marker，不知为何
         });
          

        });

        
        $scope.$on('$viewContentLoaded', function () {
          FacMap.canClick=1;
          //先备份，然后放在models中修改
          angular.extend(addrInput_bak,FacMap.addrInput);
          $scope.models=FacMap.addrInput;
        });
        $scope.$on('$destroy', function () {
          FacMap.canClick=false;
          FacMap.getSelMarker().then(function(m){
            m.hide();
            if(pos_bak)m.setPosition(pos_bak);
            if(mapZoom_bak)FacMap.mapData.map.setZoomAndCenter(mapZoom_bak,mapCenter_bak);
          })
          angular.extend(FacMap.addrInput,addrInput_bak);
        });

        
        $scope.formDefine=ProjDefine;
        $scope.models={};
        $scope.onDelete=function(){
          appData.dialogData.confirmDialog('删除【'+$scope.models.id+'】',_doDel)
        }
        function _doDel() {
          $log.log('/proj-Del .onOk');
          FacApi.callApi('steeproj','delete',{id:id})
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
          $log.log('/proj-edit .onOk');
          FacApi.callApi('steeproj','update',{id:id,d:JSON.stringify(FacMap.addrInput)})
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
