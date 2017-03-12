'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view-exbook/index/index.template.html',
    controller: ['$scope','$location','$log','ExbookService','AppbData','AppbUiService',
      function ($scope,$location,$log,ExbookService,AppbData,AppbUiService) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        var imgData=ExbookService.getImgData();
        appData.imgData=imgData;
        $scope.userData=userData;
        $scope.appData=appData;
        $scope.imgData=imgData;
        
         
        AppbData.activeHeader('exbook-back', '首页'); 
        AppbData.activeFooter('exbook-index');

        /*
        AppbUiService.setDialogData({
          title:'欢迎使用',
          content:'这是一测试',
          btn1:'呵呵',
          btn2:'hoho'
        });
        AppbUiService.showDialog();
        */
        //AppbUiService.toastLoading();
        //AppbUiService.toastDone(3);
        //AppbUiService.toastMsg('白',3);
        
        

      }
    ]
  })
}]);

//___________________________________
})();
