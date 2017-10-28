'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-add', {
    templateUrl: 'app-steefac/fac-add/fac-add.view.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','FacDefine','ProjDefine','FacMap','AppbAPI','FacUser',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,FacDefine,ProjDefine,FacMap,AppbAPI,FacUser) {
        var userData=AppbData.getUserData();
        if(! userData || !userData.token) {
          return $location.path( "/wx-login" ).search({pageTo: '/fac-add'});;
        }
        
        var types=['steefac','steeproj'];
        var names={steefac:'钢构厂',steeproj:'项目信息'};
        var defines={steefac:FacDefine,steeproj:ProjDefine};
        
        $scope.objType=$location.search().type;        
        if(! names[$scope.objType] ) {
          $scope.objType=types[0];
        }
        $scope.objName=names[$scope.objType];
        
        $scope.formDefine=defines[$scope.objType];
        
        //if(!FacUser.isSysAdmin()) {
        //  return $location.path( '/my');;
        //}
        $scope.$on('$viewContentLoaded', function () {
          FacMap.selPositionStart('header',$scope.objName+'定位');
        });
        $scope.$on('$destroy', function () {
          FacMap.selPositionEnd();
        });

        appData.setPageTitle('新增'+$scope.objName); 

        if(!FacMap.addrInput[$scope.objType+'name']) {
          return $location.path('/fac-add-find-name')
        }
        
        $scope.models=FacMap.addrInput;
        
        $scope.onOk=function(){
          $log.log('/fac-add .onOk');
          
          var dd={}
          dd.name=FacMap.addrInput[$scope.objType+'name'];
          dd.addr=FacMap.addrInput.addr;
          dd.lngE7=FacMap.addrInput.lngE7;
          dd.latE7=FacMap.addrInput.latE7;
          dd.province=FacMap.addrInput.province;
          dd.city=FacMap.addrInput.city;
          dd.district=FacMap.addrInput.district;
          dd.citycode=FacMap.addrInput.citycode;
          dd.adcode=FacMap.addrInput.adcode;
          dd.formatted_address=FacMap.addrInput.formatted_address;

          var k,i;
          for(var i=$scope.formDefine.inputs.length;i--;){
            k=$scope.formDefine.inputs[i].name;
            dd[k]=FacMap.addrInput[k]
            $log.log('FacMap.addrInput[k]',k,FacMap.addrInput[k]);
          }
          AppbAPI('steeobj','add',{type:$scope.objType,d:JSON.stringify(dd)})
          .then(function(s){
            appData.toastMsg('数据已成功保存',2);
            $location.path('/'+$scope.objType+'-detail').search({id:s.id});
            FacUser.getMyData(1);
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
