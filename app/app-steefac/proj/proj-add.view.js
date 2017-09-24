'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/proj-add', {
    templateUrl: 'app-steefac/proj/proj-add.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','ProjDefine','FacMap','FacApi','FacUser',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,ProjDefine,FacMap,FacApi,FacUser) {
        var userData=AppbData.getUserData();
        if(!FacUser.isSysAdmin()) {
          return $location.path( '/my');;
        }
        $scope.$on('$viewContentLoaded', function () {
          FacMap.canClick=1;
          FacMap.getSelMarker().then(function(m){
            m.setAwesomeIcon('header');
            m.setLabel({content:'可拖动定位',offset:new AMap.Pixel(-12,-19)})
          })
          FacMap.showSelMarker(1);
        });
        $scope.$on('$destroy', function () {
          FacMap.canClick=false;
          FacMap.showSelMarker(0);
        });

        AppbData.activeHeader('home', '新用钢项目'); 
        
        $scope.formDefine=ProjDefine;
        $scope.models=FacMap.addrInput;
        
        $scope.onOk=function(){
          $log.log('/proj-add .onOk');
          FacApi.callApi('steeproj','add',{d:JSON.stringify($scope.models)})
          .then(function(s){
            appData.toastMsg('数据已成功保存',2);
            $location.path('/proj-detail').search({id:s.id});
            
            $log.log('proj-add.sec',s);
          },function(e){
            appData.toastMsg('保存失败',8);
            $log.log('err',e);
            
          });
        }

      }
	]
  });
}]);
