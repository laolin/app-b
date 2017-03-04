'use strict';
(function(){

angular.module('appb')
.component('appbUiUploader',{
    templateUrl: 'modules/appb-ui/appb-ui-uploader.component.template.html',  
    bindings: { 
     
     imgData:"="
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){
        var ctrl=this;
        ctrl.$onInit=function(){
        }
         
        ctrl.addImg=function(){
          $log.log('..addImg');
          if(ctrl.imgData.imgs.length >= ctrl.imgData.maxCount)return;
          wx.ready(function () {
            wx.chooseImage({
              count: ctrl.imgData.maxCount-ctrl.imgData.imgs.length, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                var localIds = res.localIds; 
                ctrl.imgData.imgs=ctrl.imgData.imgs.concat(localIds);
                $log.log('localIds',localIds,ctrl.imgData);
              }
            });
          });
        }
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
