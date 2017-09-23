'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-add', {
    templateUrl: 'app-steefac/fac-add/fac-add.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','FacMap','FacApi','FacUser',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,FacMap,FacApi,FacUser) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/fac-add'});;
        }
        if(!FacUser.isSysAdmin()) {
          return $location.path( '/my');;
        }
        $scope.$on('$viewContentLoaded', function () {
          FacMap.getSelMarker().then(function(m){
            m.setAwesomeIcon('header');
            m.setLabel({content:'可拖动定位',offset:new AMap.Pixel(-12,-19)})
          })
          FacMap.showSelMarker(1);
        });
        $scope.$on('$destroy', function () {
          FacMap.showSelMarker(0);
        });

        AppbData.activeHeader('home', '新钢构厂'); 
        
        $scope.formDefine=FacDefine;
        $scope.models=FacMap.addrInput;
        
        $scope.onOk=function(){
          $log.log('/fac-add .onOk');
          FacApi.createFac({d:JSON.stringify(FacMap.addrInput)})
          .then(function(s){
            appData.toastMsg('数据已成功保存',2);
            $location.path('/fac-detail').search({id:s.id});
            
            $log.log('sec',s);
          },function(e){
            appData.toastMsg('保存失败',8);
            $log.log('err',e);
            
          });
        }

      }
	]
  });
}]);
