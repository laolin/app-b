'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    templateUrl: 'view-exbook/my/my.template.html',
    controller: ['$scope','$location','$log','ExbookService','AppbData','AppbUiService',
      function ($scope,$location,$log,ExbookService,AppbData,AppbUiService) {

        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-back', '我的'); 
        AppbData.activeFooter('exbook-index');
        
        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        
        // 使用 component 时
        //var ctrl=this;
        ctrl.userData=userData;
        ctrl.appData=appData;
        
        ctrl.swipeLeft=function() {
          appData.toastMsg('左滑',2);
        }
        ctrl.swipeRight=function() {
          appData.toastMsg('右滑',2);
        }
        var imgs=[
'wx_75652bc27fa98179631b9a81e1bef041c016ece7.jpg',
'wx_99169ec89c22809cba565213ae55035fc52b3796.jpg',
'wx_3c27d3fbb164ba6746a372d248c87d6d84767b8b.jpg',
'wx_4c7b8ac378c98c650fac786638e84f824323c381.jpg',
'wx_b3d68dc14bdf87931c2cf3c718bd09a913c35405.jpg',
'wx_73c84eeaee4c056b455c005db7433698f20af9dc.jpg',
'wx_04d5ca09c35b6c96cc5e14bfc378cd429d585bea.jpg',
'wx_07f7b7a0f508988230b50b36b2d886fdcfc58ee8.jpg',
'wx_0fd14f379ba91d2bee25455fc2648e891d5dec1b.jpg'        
        ];
        ctrl.appData.showGallery(imgs);

        
      }
    ]
  })
}]);

//___________________________________
})();
