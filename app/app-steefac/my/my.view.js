'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    pageTitle: "我的",
    templateUrl: 'app-steefac/my/my.view.template.html',
    controller: ['$scope','$timeout','$log', '$http', 'SiteConfig', 'AppbFeedService','AppbData','AppbUiService','AmapMainData','FacUser','FacSearch',
      function ($scope,$timeout,$log, $http, SiteConfig, AppbFeedService,AppbData,AppbUiService,AmapMainData,FacUser,FacSearch) {


        /** 版本日期 */
        $scope.ver = window.theSiteConfig.ver || '最新';
        $scope.ver_time = window.theSiteConfig.ver_time || new Date().toLocaleString();


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
       
        /** 从缓存中读取me数据 */
        $http.post("cache/load", { ac: "me" }).then(json => {
          if($scope.me) return;
          $scope.me = json.datas.data;
          initDatas($scope.me.me);
        });
        /** 从服务器读取me数据 */
        $http.post("用户/刷新个人信息").then(json => {
          $scope.me = json.datas;
          console.log("me = ", $scope.me)
          $http.post("cache/save", { ac: "me", data: $scope.me });
          initDatas($scope.me.me);
        });
        function initDatas(me) {
          ctrl.isLoading = 0;
          $scope.me.objCanAdmin = {}
          for (var i = ctrl.objTypes.length; i--;) {
            var str = me[ctrl.objTypes[i] + '_can_admin'];
            $scope.me.objCanAdmin[ctrl.objTypes[i]] = str ? str.split(',') : [];
            ctrl.facIds[ctrl.objTypes[i]] = str;//(me.objCanAdmin[ctrl.objTypes[i]] || []).join(',');
            if (ctrl.facIds[ctrl.objTypes[i]].length) ctrl.noIds = false;
          }
        }

        /** 浏览历史 */
        $scope.viewHistory = { list: {} };
        $http.post("cache/load", { ac: "fac-detail-history-steeproj" }).then(json => {
          var list = json.datas.data;
          if (!angular.isArray(list)) list = [];
          list = list.slice(-8);
          $scope.viewHistory.steeproj = list.join(',');
          $scope.viewHistory.list.steeproj = list;
          $scope.viewHistory.totle = $scope.viewHistory.list.steefac.length + $scope.viewHistory.list.steeproj.length;
        });
        $http.post("cache/load", { ac: "fac-detail-history-steefac" }).then(json => {
          var list = json.datas.data;
          if (!angular.isArray(list)) list = [];
          list = list.slice(-8);
          $scope.viewHistory.steefac = list.join(',');
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
        
        $scope.updateComment=function() {
          console.log("升级评论业绩数据库");
          $http.post("显示对话框/confirm", { body: "升级评论业绩数据库后，非原来的评论业绩数据库将被清除，且不可恢复。确认？", title: "删除前，请确认：" }).then(json => {
            $http.post(SiteConfig.apiRootUnit + "comment/comment/updateDB").then(json=>{
              $http.post("显示对话框/alert", { body: "升级成功" })
            }).catch(e=>{
              console.log("升级失败,", e)
            })
          });
        }
        
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
