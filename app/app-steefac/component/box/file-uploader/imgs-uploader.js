(function () {

  angular.module('dj-component')
    .directive("multiFileUpload", function () {
      return {
        controller: ['$scope', '$element', function ($scope, $element) {
          $element.bind("change", function (e) {
            console.log('有文件');
            $scope.change && $scope.change({ $files: e.target.files });
          });
        }],
        scope: {
          change: "&"
        }
      }
    })
    .component('imgsUploader', {
      templateUrl: 'app-steefac/component/box/file-uploader/imgs-uploader.template.html',
      bindings: {
        maxCount: "<",
        imgs: "<",
        updateImg: "&" //选择图片更新用的回调函数
      },
      controller: ['$scope', '$http', 'uiUploader', 'APP', 'sign', ctrl]
    });

  function ctrl($scope, $http, uiUploader, APP, sign) {
    var imgData = this.imgData = { uploadings: [] };
    this.countError = 0;
    this.$onInit = function () {
      APP.SiteConfig
    }
    this.$onChanges = function (chg) {
      $scope.imgList = this.imgs || [];
    }

    this.deleteImg = (n) => {
      if (n < 0 || n >= this.imgs.length) return;
      $scope.imgList.splice(n, 1);
      this.updateImg({ imgs: $scope.imgList });
    }
    this.clickImg = (n) => {
      //this.appData.showGallery(this.imgs, n, this.deleteImg);
    }
    this.addImg = (fn) => {
      if ($scope.imgList.length >= this.maxCount) return;
      $scope.imgList.push(fn);
      this.updateImg({ imgs: $scope.imgList });
    };



    /**
     * 上传模块
     **/
    var self = this;
    $scope.imgPath = "https://pgytc.oss-cn-beijing.aliyuncs.com/cmoss/upload-img/";
    var File = $scope.File = {
      prePost: sign.prePost("upload", "img", {}),
      subTreeId: 0,
      uploadingFiles: [],

      /**
       * 文件选择事件
       **/
      onFile: function (files) {
        console.log(files);
        if (!files) return;
        uiUploader.addFiles(files);
        console.info('添加文件', files);
        File.uploadingFiles = uiUploader.getFiles();
        $scope.$apply();
        this.upload();
      },

      /**
       * 上传
       **/
      upload: function () {
        var data = { treeName: File.treeName, treeId: File.subTreeId };
        console.info('uploading...');
        var prePost = sign.prePost("upload", "img", {});
        uiUploader.startUpload({
          url: prePost.url,
          data: prePost.post,
          concurrency: 20,
          onProgress: function (file) {
            console.log("进度", file.name + '=' + file.humanSize);
            file.per = (file.loaded / file.size * 100).toFixed(2);
            if(file.per > 100) file.per = 100;
            $scope.$apply();
          },
          onError: function (e) {
            console.info('上传失败:', e);
          },
          onCompleted: function (file, response) {
            var json = JSON.parse(response);
            if(json.datas){
              self.addImg(json.datas.url); 
            }
            var url = json.datas && json.datas.url;
            console.info('上传完成:' + file.name + ',json = ', json);
            uiUploader.removeFile(file);
            $scope.$apply();
          }
        });
      }
    }

  }

})();
