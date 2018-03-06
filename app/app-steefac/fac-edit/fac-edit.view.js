'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fac-edit', {
    templateUrl: 'app-steefac/fac-edit/fac-edit.view.template.html',
    controller: ['$scope','$http','$log','$location',
        'AppbData','ProjDefine','FacMap','SIGN','FacUser','FacSearch',
      function mzUserSearchCtrl($scope,$http,$log,$location,
          AppbData,ProjDefine,FacMap,SIGN,FacUser,FacSearch) {
        var userData=AppbData.getUserData();

        $scope.isLoading=2;
        


        
        //var objtype;
        //objtype='steeproj';
        
        

        var search=$location.search();
        var id=parseInt(search.id);
        var objtype=search.type;
        if(!FacSearch.isTypeValid(objtype)) {
          return appData.showInfoPage('类型错误','E:type:'+objtype,'/my');
        }

        appData.setPageTitleAndWxShareTitle('修改'+FacSearch.objNames[objtype]); 
        
        $scope.formDefine=FacSearch.objDefines[objtype];
        $scope.models=FacMap.addrInput;

        //1 获取个人数据
        FacUser.getMyData(false).then(function(s){
          $scope.isSysAdmin=FacUser.isSysAdmin();
          if($scope.isSysAdmin)$scope.canEdit=true;
          else $scope.canEdit=FacUser.canAdminObj(objtype,id)
          if(!$scope.canEdit) {
            appData.showInfoPage('错误','没有编辑权限','/my');
          }
          $scope.isLoading--;
          
        },function(e){
          appData.showInfoPage('获取数据错误',e,'/search');
        });
        
        //2 获取 编辑对象数据
        FacSearch.getDetail(objtype,id).then(function(s){
          if(!s) {
            return appData.showInfoPage('参数错误','Err id: '+id,'/search')
          }
          $scope.isLoading--;
          FacMap.selPositionStart(FacSearch.objIcons[objtype],s.name.substr(0,4),new AMap.LngLat(s.lngE7/1e7,s.latE7/1e7));
          angular.extend($scope.models,s);
          FacMap.addrInput[objtype+'name']=s.name;
        },function(e){
          return appData.showInfoPage('获取数据错误',e,'/search');
        });

        
        $scope.$on('$viewContentLoaded', function () {
        });
        $scope.$on('$destroy', function () {
          FacMap.selPositionEnd();
        });

        
        $scope.onDelete=function(){
          appData.dialogData.msgBox(
            '请您确认：您将删除'+
            '【'+$scope.models.name+'】(id='+id+')。',
            '删除'+FacSearch.objNames[objtype],
            '删除','取消',_doDel);
          
          
        }
        function _doDel() {
          $log.log('/obj-Del .onOk');
          SIGN.postLaolin('steeobj','delete',{type:objtype,id:id})
          .then(function(s){
            if(s) {
              delete FacSearch.datailCache[objtype+id];
              appData.toastMsg('数据已删除',2);
              $location.path( "/search" )
              FacUser.getMyData(1);
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
          $log.log('/obj-edit .onOk');

          var dd={}
          dd.name=FacMap.addrInput[objtype+'name'];
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






          
          //TODO 没有更新的数据别上传
          SIGN.postLaolin('steeobj','update',{type:objtype,id:id,d:JSON.stringify(dd)})
          .then(function(s){
            delete FacSearch.datailCache[objtype+id];
            appData.toastMsg('数据已成功更新',2);
            var nextPage = objtype=='steefac'
              && "/fac-detail/" + id
              || "/project-detail/" + id;
            $location.path(nextPage);
          },function(e){
            appData.toastMsg(e,3);//'更新失败'+
            $log.log('err',e);
          });
        }

      }
	]
  });
}]);
