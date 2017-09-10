'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-edit', {
    templateUrl: 'app-steefac/fac-add/fac-edit.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','FacMap','FacApi',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,FacMap,FacApi) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/my'});;
        }
        var addrInput_bak={};
        var mapCenter_bak,mapZoom_bak,pos_bak;
        
        var search=$location.search();
        var id=parseInt(search.id);
        FacApi.callApi('steefac','detail',{id:id}).then(function(s){
          $log.log('detail',s);
          FacDefine.formatObj(s);
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
            FacMap.mapData.map.panBy(1,1);//不动一点点有时显示不出来 marker，不知为何
         });
          

        });

        
        $scope.$on('$viewContentLoaded', function () {
          //先备份，然后放在models中修改
          angular.extend(addrInput_bak,FacMap.addrInput);
          $scope.models=FacMap.addrInput;
        });
        $scope.$on('$destroy', function () {
          FacMap.getSelMarker().then(function(m){
            m.hide();
            m.setPosition(pos_bak);
            FacMap.mapData.map.setZoomAndCenter(mapZoom_bak,mapCenter_bak);
          })
          angular.extend(FacMap.addrInput,addrInput_bak);
        });

        
        $scope.formDefine=FacDefine;
        $scope.models={};
        $scope.onUpdate=function(){
          $log.log('/fac-edit .onOk');
          FacApi.callApi('steefac','update',{id:id,d:JSON.stringify(FacMap.addrInput)})
          .then(function(s){
            appData.toastMsg('数据已成功更新',2);
            $log.log('sec',s);
          },function(e){
            appData.toastMsg('更新失败',8);
            $log.log('err',e);
          });
        }

      }
	]
  });
}]);
