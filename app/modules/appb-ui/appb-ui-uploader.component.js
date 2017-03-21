'use strict';
(function(){

angular.module('appb')
.component('appbUiUploader',{
    templateUrl: 'modules/appb-ui/appb-ui-uploader.component.template.html',  
    bindings: { 
     appData:"<",
     
     imgInput:"<",
     sep:'@',
     maxCount:"<",
     
     updateImg:"&" //选择图片更新用的回调函数
    },
    controller: ['$scope','$log','$http',
      function ($scope,$log,$http){
        
        var ctrl=this;
        var imgData=ctrl.imgData={imgs:[],serverIds:[],uploadings:[]};
        
        ctrl.$onInit=function(){
          $log.log('appbUiUploader onInit');
        }
        ctrl.$onChanges=function(chg){
          //$log.log(' 1* appbUiUploader onChanges',chg);
          if(chg.imgInput) {
            ctrl.imgInput=chg.imgInput.currentValue;
            if(ctrl.imgInput && ctrl.imgInput.length>0) {
              imgData.imgs=ctrl.imgInput.split(',');
            } else {
              imgData.imgs=[];
            }
            //$log.log('chg.imgInput',chg.imgInput.currentValue,imgData);
          }
        }
         
        ctrl.addImg=function(){
          $log.log('..addImg');
          if(imgData.imgs.length >= ctrl.maxCount)return;
          if(1 && !ctrl.appData.isWeixinBrowser) {
            // TODO 电脑上处理上传图片 
            var n1=imgData.imgs.length;
            
            //模拟上传图片，返回图片ID：imgid
            var imgid='wx_a0a0a9880e4ede3e6367fea148b929e06f421398.jpg';
            //imgData.imgs[n1]=ctrl.appData.urlApi('file','g',imgid);
            imgData.imgs[n1]=imgid;
            //把数据写回
            ctrl.updateImg({img:imgData.imgs});
            return;
          }
          wx.ready(function () {
            wx.chooseImage({
              count: ctrl.maxCount-imgData.imgs.length, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                var localIds = res.localIds; 
                var n=imgData.imgs.length;
                for(var i=0;i<localIds.length;i++,n++) {
                  imgData.imgs[n]=localIds[i];
                  imgData.uploadings[n]=1;
                }
                ctrl.uploadImg();
                $scope.$apply();
              }
            });
          });
        };//end of ctrl.addImg
        ctrl.uploadImg=function(){
          var ni=imgData.imgs.length;
          var ns=imgData.serverIds.length;
          if(ns>=ni)return;
          $log.log('==== Upload start.......','n-img=',ni,'ns=',ns);
          //ctrl.appData.toastMsg('Upload i='+ni+',s='+ns);
          wx.uploadImage({
            localId: imgData.imgs[ns], // 需要上传的图片的本地ID
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
              imgData.serverIds[ns] = res.serverId; // 返回图片的服务器端ID
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
                    return;
                  }
                  //d.data.data.name 是api上传后的文件ID
                  //可以通过 apiRoot/file/g/ID 或获得文件
                  //imgData.imgs[ns]=ctrl.appData.urlApi('file','g',d.data.data.name);
                  imgData.imgs[ns]=d.data.data.name;
                  //上传到自己的服务器完成后 serverId 就丢弃掉
                  imgData.serverIds[ns]='';
                  imgData.uploadings[ns]=0;
                  //把数据写回
                  ctrl.updateImg({img:imgData.imgs});
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
