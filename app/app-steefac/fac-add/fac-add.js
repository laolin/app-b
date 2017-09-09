'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-add', {
    templateUrl: 'app-steefac/fac-add/fac-add.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','FacMap','FacApi',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,FacMap,FacApi) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/fac-add'});;
        }
        
        $scope.formDefine=FacDefine;
        $scope.onOk=function(){
          $log.log('/fac-add .onOk');
          FacApi.createFac(angular.extend(FacDefine.models,FacMap.facAddr))
          .then(function(s){
            appData.toastMsg('数据已成功保存',2);
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
