'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/obj-detail', {
templateUrl: 'app-steefac/fac-detail/obj-detail.view.template.html',
  controller: ['$scope','$http','$log','$location',
    'AppbData','FacDefine','FacSearch','SIGN','FacUser',
  function ($scope,$http,$log,$location,
    AppbData,FacDefine,FacSearch,SIGN,FacUser) {
    var appData=AppbData.getAppData();
    var userData=AppbData.getUserData();
    if(! userData || !userData.token) {
      return $location.path( "/wx-login" ).search({pageTo: '/my'});;
    }

    
    var options=FacDefine.goodatOptions;
    
    var search=$location.search();
    var id=parseInt(search.id);
    var objType=search.type;
    var myUid=appData.userData.uid;
    
    if(!FacSearch.isTypeValid(objType)) {
      return appData.showInfoPage('类型错误','E:type:'+objType,'/my');
    }
    var objName=FacSearch.objNames[$scope.objType];

    appData.setPageTitleAndWxShareTitle( objName+'详情'); 
    
    // 1,'steefac-detail'| 2,'stee_user-get_admin_of_fac'
    $scope.isLoading=2;
    
    $scope.FacUser=FacUser;
    $scope.fac={};
    $scope.objType=objType;
    $scope.id=id;
    $scope.canEdit=false;

    
    FacSearch.getDetail(objType,id).then(function(s){
      if(!s) {
        return appData.showInfoPage('参数错误','Err id: '+id,'/search')
      } 
      appData.setPageTitleAndWxShareTitle(s.name+'-详情');
      $scope.fac=s;
      $scope.isLoading--;
      /*
      var fee;
      $scope.goodat=[];
      if(s.goodat) {
        s.goodat.split(',').forEach(function(val,ind){
          $scope.goodat[ind]={text:val,icon:'check-circle',url:''};
          fee=s.feeObj[options.indexOf(val)];
          if(fee)$scope.goodat[ind]['notes']='加工费'+fee+'元/吨';
        });
      }*/
      get_admin_of_obj();
    },function(e){
      $log.log('detail Err',e);
      return appData.showInfoPage('获取数据错误',e,'/search')
    });
    function get_admin_of_obj(){
      FacUser.getMyData(false).then(function(s){
        if(FacUser.isSysAdmin())$scope.canEdit=true;
      },function(e){$log.log('Err:',e)});
      
      SIGN.postLaolin('stee_user','get_admin_of_obj',{type:objType,facid:id}).then(function(s){
        $log.log('get_admin_of:',objType,s);
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
        $log.log('get_admin_of_obj Err',e);
        return appData.showInfoPage('数据错误',e,'/search')
      });
    }

    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$destroy', function () {
    });

        
        

  }]

});
}]);
