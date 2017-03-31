'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/explore', {
    templateUrl: 'view-exbook/explore/explore.template.html',
    controller: ['$scope','$http','$log','ExbookService','AppbData',
      function ($scope,$http,$log,ExbookService,AppbData) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        AppbData.activeHeader('exbook-back', '发现'); 
        AppbData.activeFooter('exbook-index');

        //要求登录，如果未登录，会自动跳转到登录界面
        appData.requireLogin();
        
        $scope.$on('$destroy', function iVeBeenDismissed() {
          // say goodbye to your controller here
          // release resources, cancel request...
          //$log.log('exbook/explore $destroy');
        });
        $scope.$on('$viewContentLoaded', function readyToTrick() {
          // say hello to your new content here
          // BUT NEVER TOUCHES THE DOM FROM A CONTROLLER
          //$log.log('exbook/explore $viewContentLoaded');
        });

        //使用ctrl, 后面方便切换为 component
        var ctrl=$scope.$ctrl={};
        
        // 使用 component 时
        //var ctrl=this;
        ctrl.userData=userData;
        ctrl.appData=appData;
        if( !appData.ebData.feedList || !appData.ebData.feedList.length) {
          appData.ebData.exploreFeed();
        }
        ctrl.showNewMore=function(){
            appData.ebData.exploreFeed({newMore:1});
        }
        ctrl.showOldMore=function(){
          if(appData.ebData.hasOldMore)
            appData.ebData.exploreFeed({oldMore:1});
        }

        
        
      }
    ]
  })
}]);

//___________________________________
})();
