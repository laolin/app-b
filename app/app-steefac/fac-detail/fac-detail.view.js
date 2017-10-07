'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/fac-detail', {
templateUrl: 'app-steefac/fac-detail/fac-detail.template.html',
  controller: ['$scope','$http','$log','$location',
    'AppbData','FacDefine','FacMap','FacApi','FacUser',
  function ($scope,$http,$log,$location,
    AppbData,FacDefine,FacMap,FacApi,FacUser) {
    var appData=AppbData.getAppData();
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }

    appData.setPageTitle('钢构厂详情'); 
    var options=FacDefine.goodatOptions;
    
    var search=$location.search();
    var id=parseInt(search.id);
    var myUid=appData.userData.uid;
    
    // 1,'steefac','detail'| 2,'stee_user','get_admin_of_fac'
    $scope.isLoading=2;
    
    $scope.FacUser=FacUser;
    $scope.fac={};
    $scope.id=id;
    $scope.canEdit=false;
    $scope.id=id;

    
    FacApi.callApi('steefac','detail',{id:id}).then(function(s){
      if(!s) {
        return appData.showInfoPage('参数错误','Err id: '+id,'/search')
      }
      FacDefine.formatObj(s);
      $scope.fac=s;
      $log.log('detail',s);
      $scope.isLoading--;
      var fee;
      $scope.goodat=[];
      if(s.goodat) {
        s.goodat.split(',').forEach(function(val,ind){
          $scope.goodat[ind]={text:val,icon:'check-circle'};
          fee=s.feeObj[options.indexOf(val)];
          if(fee)$scope.goodat[ind]['notes']='加工费'+fee+'元/吨';
        });
      }
      _get_admin_of_fac();
    },function(e){
      $log.log('detail Err',e);
      return appData.showInfoPage('获取数据错误',e,'/search')
    });
    function _get_admin_of_fac(){
      FacUser.getMyData().then(function(s){
        if(FacUser.isSysAdmin())$scope.canEdit=true;
      },function(e){$log.log('Err:',e)});
      FacApi.callApi('stee_user','get_admin_of_fac',{facid:id}).then(function(s){
        $log.log('get_admin_of_fac',s);
        $scope.isLoading--;
        if(s) {
          var uids=[];
          for(var i=s.length;i--; ) {
            if(myUid==s[i].uid)$scope.canEdit=true;
            uids.push({uid:s[i].uid});
          }
          userData.requireUsersInfo(uids).then(function(){
            $scope.uids=uids;
            $scope.usersInfo=userData.usersInfo;          
          });
        }
      },function(e){
        $log.log('get_admin_of_fac Err',e);
      });
    }

    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$destroy', function () {
    });

        
        

  }]

});
}]);
