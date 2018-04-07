'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    pageTitle: "我的",
    templateUrl: 'app-steefac/my/my.view.template.html',
    controller: ['$scope','$timeout','$log', '$http', 'AppbFeedService','AppbData','AppbUiService','AmapMainData','FacUser','FacSearch',
      function ($scope,$timeout,$log, $http, AppbFeedService,AppbData,AppbUiService,AmapMainData,FacUser,FacSearch) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();

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
          $scope.me = me;
          for(var i=ctrl.objTypes.length;i--; ) {
            ctrl.facIds[ctrl.objTypes[i]] = (me.objCanAdmin[ctrl.objTypes[i]] || []).join(',');
            if(ctrl.facIds[ctrl.objTypes[i]].length)ctrl.noIds=false;
          }
          ctrl.isLoading=0;
        });

        /** 浏览历史 */
        $scope.viewHistory = { list: {} };
        $http.post("cache/load", { ac: "view-steeproj" }).then(json => {
          var list = json.datas.data;
          if (!angular.isArray(list)) list = [];
          $scope.viewHistory.steeproj = list.slice(-10).join(',');
          $scope.viewHistory.list.steeproj = list;
          $scope.viewHistory.totle = $scope.viewHistory.list.steefac.length + $scope.viewHistory.list.steeproj.length;
        });
        $http.post("cache/load", { ac: "view-steefac" }).then(json => {
          var list = json.datas.data;
          if (!angular.isArray(list)) list = [];
          $scope.viewHistory.steefac = list.slice(-10).join(',');
          $scope.viewHistory.list.steefac = list;
          $scope.viewHistory.totle = $scope.viewHistory.list.steefac.length + $scope.viewHistory.list.steeproj.length;
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
