'use strict';
(function(){

angular.module('appb')
.component('appbUiUploader',{
    templateUrl: 'modules/appb-ui/appb-ui-uploader.component.template.html',  
    bindings: { 
     appData:"<",
     maxCount:"<",
     
     imgs:"=",
     updateImg:"&" //选择图片更新用的回调函数
    },
    controller: ['$scope','$log','$http',
      function ($scope,$log,$http){
        
        var ctrl=this;
        var imgData=ctrl.imgData={uploadings:[]};
        ctrl.countError=0;
        ctrl.$onInit=function(){
        }
        ctrl.$onChanges=function(chg){
        }
        
        ctrl.deleteImg=function(n){
          if(n<0 || n>=ctrl.imgs.length)return;
          ctrl.imgs.splice(n,1);
          ctrl.updateImg({imgs:ctrl.imgs});
        }
        ctrl.clickImg=function(n){
          ctrl.appData.showGallery(ctrl.imgs,n,ctrl.deleteImg);
        }
        ctrl.addImg=function(){
          $log.log('..addImg');
          if(ctrl.imgs.length >= ctrl.maxCount)return;
          if(1 && !ctrl.appData.isWeixinBrowser) {
            // TODO 电脑上处理上传图片 
            var n1=ctrl.imgs.length;
            
            //模拟上传图片，返回图片ID：imgid
            var imgid='like.png';
            ctrl.imgs[n1]=imgid;
            //把数据写回
            ctrl.updateImg({imgs:ctrl.imgs});
            return;
          }
          wx.ready(function () {
            wx.chooseImage({
              count: ctrl.maxCount-ctrl.imgs.length, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                var localIds = res.localIds; 
                var n=ctrl.imgs.length;
                for(var i=0;i<localIds.length;i++,n++) {
                  ctrl.imgs[n]=localIds[i];
                  imgData.uploadings[n]=1;
                }
                ctrl.uploadImg();
                $scope.$apply();
              }
            });
          });
        };//end of ctrl.addImg
        ctrl.uploadImg=function(){
          var ni=ctrl.imgs.length;
          var ns;
          for(ns=0;ns<ni;ns++) {
            if(imgData.uploadings[ns])
              break;
          }
          if(ns>=ni)return;
          $log.log('==== Upload start.......','n-img=',ni,'ns=',ns);
          //ctrl.appData.toastMsg('Upload i='+ni+',s='+ns);
          wx.uploadImage({
            localId: ctrl.imgs[ns], // 需要上传的图片的本地ID
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
              $log.log('____Upload to wx server','n-img=',ni,'ns=',ns);
              //ctrl.appData.toastMsg('Updone i='+ni+',s='+ns);
              $scope.$apply();
              var apiUp=ctrl.appData.urlSignApi('wx','mediaget');

              apiUp+='&media_id=' + res.serverId;

              $http.jsonp(apiUp)
                .then(function(d){
                  $log.log('upload our server=',d.data.data);
                  //ctrl.appData.toastMsg('UpRes');
                  if(d.data.errcode!=0 || ! d.data.data) {
                    ctrl.appData.setDialogData({
                      title:'api-upload Data Err!',
                      content:'ns='+ns+',= '+JSON.stringify(d.data)+
                      'Updone i='+ni+',s='+ns+','+res.serverId,
                      btn1:'OK',
                      show:1
                    });
                    if(ctrl.countError++<10)ctrl.uploadImg();//错误次数不太多时继续重试
                    return;
                  }
                  //d.data.data.name 是api上传后的文件ID
                  //可以通过 apiRoot/file/g/ID 或获得文件
                  ctrl.imgs[ns]=d.data.data.name;
                  imgData.uploadings[ns]=0;
                  //把数据写回
                  ctrl.updateImg({imgs:ctrl.imgs});
                  ctrl.countError=0;
                  if(ns<ni-1)ctrl.uploadImg();//传一下张图片
                },function(a){
                  if(ctrl.countError++<10)ctrl.uploadImg();//错误次数不太多时继续重试
                  appData.setDialogData({
                    title:'api-upload callback Err!',
                    content:'ns='+ns+',= '+JSON.stringify(a),
                    btn1:'OK',
                    show:1
                  });
                })
              
            }
          });
        }////end of ctrl.uploadImg
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
