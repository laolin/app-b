'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    pageTitle: "我的",
    templateUrl: 'app-steefac/my/my.view.template.html',
    controller: ['$scope','$timeout','$log','AppbFeedService','AppbData','AppbUiService','AmapMainData','FacUser','FacSearch',
      function ($scope,$timeout,$log,AppbFeedService,AppbData,AppbUiService,AmapMainData,FacUser,FacSearch) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();

        FacUser.getMyData().then(me =>{
          console.log('me = ', me);
          $scope.me = me;
        })

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        
        // 使用 component 时
        //var ctrl=this;
        
        ctrl.FacUser=FacUser;
        ctrl.isLoading=1;
        ctrl.objTypes=FacSearch.objTypes;
        ctrl.objNames=FacSearch.objNames;
        ctrl.facIds={};
        ctrl.noIds=true;
       
        FacUser.getMyData().then(function (me) {
          for(var i=ctrl.objTypes.length;i--; ) {
            ctrl.facIds[ctrl.objTypes[i]] = (me.objCanAdmin[ctrl.objTypes[i]] || []).join(',');
            if(ctrl.facIds[ctrl.objTypes[i]].length)ctrl.noIds=false;
          }
          $log.log('me.objCanAdmin',ctrl.facIds);
          ctrl.isLoading=0;
        });
        
        $scope.$on('$viewContentLoaded', function () {
        });
        $scope.$on('$destroy', function () {
        });

        
        ctrl.userData=userData;
        ctrl.appData=appData;
        ctrl.assetsRoot=appData.appCfg.assetsRoot;
        
        
        ctrl.onDisableSysAdmin=function() {
          var me;
          me=appData.userData.wxinfo;
          me.nickname='请高手用户';
          me.headimgurl='https://api.qinggaoshou.com/api-eb/uploads/wx_ee6518de6283518eac17ba8d10eb5da41947f3a2.jpg';
          
          me=appData.userData.usersInfo[appData.userData.uid];
          if(me) {
            me.wxinfo.nickname='请高手用户';
            me.wxinfo.headimgurl='https://api.qinggaoshou.com/api-eb/uploads/wx_ee6518de6283518eac17ba8d10eb5da41947f3a2.jpg';
          }
        }
        ctrl.swipeCount=0;
        ctrl.swipeLeft=function() {
          if( ctrl.swipeCount++ < 8 )return;
          appData.toastMsg(window.__buildTime,2);
        }
        ctrl.swipeRight=function() {
          appData.toastMsg('重登录',2);
          window.location.hash = "#!/login";
        }
      }
    ]
  })
}]);

//___________________________________
})();
