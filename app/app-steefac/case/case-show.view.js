'use strict';

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/case-show', {
  pageTitle: "钢构厂业绩",
templateUrl: 'app-steefac/case/case-show.view.template.html',
controller: ['$scope','$http','$log','$location',
  'AppbData','FacSearch','SIGN','FacUser','FacDefine',
function ($scope,$http,$log,$location,
  AppbData,FacSearch,SIGN,FacUser,FacDefine) {
  var appData=AppbData.getAppData();
  var userData=AppbData.getUserData();

  var search=$location.search();
  $scope.id=parseInt(search.id);
  $scope.isLoading=1;
  
  var myUid=appData.userData.uid;
    
  if(!$scope.id) {
    return appData.showInfoPage('参数错误','Err id: '+$scope.id,'/search')
  }
  //==================
  $scope.feedApp='steeFacCase';
  $scope.feedCat='fac_case_'+$scope.id;
  $scope.nextPage="/case-show?id="  + $scope.id;

  FacSearch.getDetail('steefac',$scope.id).then(function(s){
    $scope.isLoading=0;
    if(!s) {
      return appData.showInfoPage('参数错误','Err id: '+$scope.id,'/search')
    }
    FacDefine.formatObj(s);
    appData.setPageTitleAndWxShareTitle(s.name);
    $scope.fac=s;
  },function(e){
    return appData.showInfoPage('发生错误',e+', id:'+$scope.id,'/search')
  });

  $scope.canEdit=false;
  $scope.hidePoster=true;
  _get_admin_of_fac();
    function _get_admin_of_fac(){
      FacUser.getMyData().then(function(s){
        if(FacUser.isSysAdmin()) {
          $scope.canEdit=true;
          $scope.hidePoster=false;
        }
      },function(e){$log.log('Err:',e)});
      SIGN.postLaolin('stee_user','get_admin_of_fac',{facid:$scope.id}).then(function(s){
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
