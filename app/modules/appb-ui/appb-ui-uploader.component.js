'use strict';
(function(){

angular.module('appb')
.component('appbUiUploader',{
    templateUrl: 'modules/appb-ui/appb-ui-uploader.component.template.html',  
    bindings: { 
     appData:"<",//for debug info ( show dialog )
     apiRoot:"<",
     imgData:"="
    },
    controller: ['$scope','$log','$http',
      function ($scope,$log,$http){
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
                ctrl.uploadImg();
                $scope.$apply();
              }
            });
          });
        };//end of ctrl.addImg
        ctrl.uploadImg=function(){
          var ni=ctrl.imgData.imgs.length;
          var ns=ctrl.imgData.serverIds.length;
          if(ns>=ni)return;
          $log.log('==== Upload start.......','n-img=',ni,'ns=',ns);
          wx.uploadImage({
            localId: ctrl.imgData.imgs[ns], // 需要上传的图片的本地ID
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              ctrl.imgData.serverIds[ns] = res.serverId; // 返回图片的服务器端ID
              $log.log('____Upload done','n-img=',ni,'ns=',ns);
              $scope.$apply();
              var apiUp=ctrl.apiRoot+'/wx/mediaget?media_id=';
              apiUp+=res.serverId;
              $http.jsonp(apiUp)
                .then(function(d){
                  $log.log('api-upload result=',d.data.data);
                  if(d.data.errcode!=0 || ! d.data.data) {
                    appData.setDialogData({
                      title:'api-upload Data Err!',
                      content:'ns='+ns+',= '+JSON.stringify(d.data),
                      btn1:'OK',
                      show:1
                    });
                    return;
                  }
                  //d.data.data.name 是api上传后的文件ID
                  //可以通过 apiRoot/file/g/ID 或获得文件
                  ctrl.imgData.imgs[ns]=ctrl.apiRoot+'/file/g/'
                  ctrl.imgData.imgs[ns]+=d.data.data.name;
                  ctrl.imgData.apiFileIds[ns]=d.data.data.name;
                },function(a){
                  appData.setDialogData({
                    title:'api-upload callback Err!',
                    content:'ns='+ns+',= '+JSON.stringify(a),
                    btn1:'OK',
                    show:1
                  });
                })
              
              if(ns<ni-1)ctrl.uploadImg()
            }
          });
        }////end of ctrl.uploadImg
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
