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
        $scope.userData=userData;
        $scope.appData=appData;
        $scope.imgData=imgData;
        
        //if(! userData || !userData.token) {
        //  return $location.path( "/wx-login" ).search({pageTo: '/'});
        //}

        $scope.logout=function() {
          //userData.token='';
          appData.setUserData({});//Update to localStorage
          //$location.path('/wx-login');
        }
         
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
        
        

        $scope.exImgData={
          title:'题图123',
          maxCount:5,
          add:$scope.csimg,
          imgs:[
            {url:'',title:'img 1  国中国中国载'},
            {url:'',title:'img 2谷中华人民共和国'}
          ]
        };
        $scope.rightImgData={
          title:'答案1',
          maxCount:3,
          add:$scope.csimg,
          imgs:[
            {url:''},
            {url:'',title:'i2'},
            {url:'',title:'i3'}
          ]
        };
        $scope.errorImgData={
          title:'错答',
          maxCount:3,
          add:$scope.csimg,
          imgs:[
            {url:'',title:'ssi2'},
            {url:'',title:'tti3'}
          ]
        };
        $scope.exData=[];
          
        $scope.csimg=function(){
          $log.log('$scope.csimg');
          wx.ready(function () {
            wx.chooseImage({
              count: 3, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              }
            });
          });
        }
      }
    ]
  })
}]);

//___________________________________
})();
