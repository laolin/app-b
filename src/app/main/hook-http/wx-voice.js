!(function (angular, window, undefined) {

  /**
   * 微信声音功能拦截
   *
   * wx.downloadVoice 将音频的服务器ID转换为本地ID：
   * wx.startRecord  用户要求开始录音：
   * wx.onVoiceRecordEnd 录音时间超过一分钟没有停止的时候会执行 complete 回调
   * wx.stopRecord 用户要求停止录音：
   * wx.uploadVoice 需要上传的音频的本地ID，由stopRecord接口获得，上传声音到自己的服务器
   * wx.playVoice 利用微信播放声音：
   */
  var theModule = angular.module('wx-jssdk');

  theModule.factory('WxVoiceBase', ['$q', 'WxJssdk', function ($q, WxJssdk) {

    /** 从微信服务器下载音频 */
    function ready() {
      return WxJssdk.initWx();
    }


    /** 从微信服务器下载音频 */
    function fromServerId(serverId) {
      return ready().then(wx => {
        var deferred = $q.defer();
        wx.downloadVoice({
          serverId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            deferred.resolve(res.localId);
          },
          fail: function (res) {
            deferred.reject(res);
          }
        });
        return deferred.promise;
      });
    }

    /** 转换为微信服务器音频id */
    function toServerId(localId) {
      return ready().then(wx => {
        var deferred = $q.defer();
        wx.uploadVoice({
          localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            deferred.resolve(res.serverId);
          },
          fail: function (res) {
            deferred.reject(res);
          }
        });
        return deferred.promise;
      });
    }

    /** 开始录音 */
    function startRecord(localId) {
      return ready().then(wx => {
        var deferred = $q.defer();
        // 启动微信录音
        wx.startRecord({
          success: (res) => {
            deferred.resolve(res);
          }
        });
        return deferred.promise;
      });
    }

    /** 录音时间超过一分钟，会自动触发 */
    function onVoiceRecordEnd() {
      return ready().then(wx => {
        var deferred = $q.defer();
        wx.onVoiceRecordEnd({
          complete: (res) => {
            deferred.resolve(res);
          }
        });
        return deferred.promise;
      });
    }

    /** 手动停止录音 */
    function stopRecord() {
      return ready().then(wx => {
        var deferred = $q.defer();
        wx.stopRecord({
          complete: (res) => {
            deferred.resolve(res);
          }
        });
        return deferred.promise;
      });
    }

    /** 播放录音 */
    function playVoice(localId) {
      return WxJssdk.initWx().then(wx => {
        wx.playVoice({ localId });
        return wx;
      });
    }

    /** 播放结束 */
    function onVoicePlayEnd() {
      return WxJssdk.initWx().then(wx => {
        s
        var deferred = $q.defer();
        wx.onVoicePlayEnd({
          success: (res) => {
            deferred.resolve(res.localId);
          }
        });
        return deferred.promise;
      });
    }

    /** 暂停播放录音 */
    function pauseVoice(localId) {
      return WxJssdk.initWx().then(wx => {
        wx.pauseVoice({ localId });
      });
    }

    return {
      ready,
      fromServerId,
      toServerId,
      startRecord,
      onVoiceRecordEnd,
      stopRecord,
      playVoice,
      onVoicePlayEnd,
      pauseVoice,
    }
  }]);




  /**
   * 微信音频
   *
   * ------------ 录音 ------------
   *
   * $scope.record = new WxRecord();
   *
   * 按钮事件
   * $scope.beginRecord = function(){
   *   $scope.record.start().then(localId => {
   *     // localId can play like:
   *     // wx.playVoice({localId: localId});
   *
   *     // 如果想上传到自己的服务器
   *     $scope.record.toServerId().then(serverId => {
   *       $http.post('your api', {serverId})
   *     });
   *   })
   * }
   * $scope.stopRecord = function(){
   *   $scope.record.stop();
   * }
   *
   * ------------ 播放 ------------
   *
   * $scope.play = function(){
   *   $scope.record.playVoice().then(()=>{
   *     console.log('play end.');
   *   };
   * }
   * $scope.pause = function(){
   *   $scope.record.pauseVoice();
   * }
   */
  theModule.factory('WxRecord', ['$rootScope', '$q', 'sign', 'WxVoiceBase', function ($rootScope, $q, sign, WxVoiceBase) {

    /**
     * 进度计时器，毫秒
     */
    var ProcessTimer = (function () {
      function ProcessTimer(callback) {
        this.callback = callback;
      }

      ProcessTimer.prototype = {
        start: function (ms) {
          clearInterval(this.id);
          this.msFrom = + new Date();
          this.id = setInterval(() => {
            var ms = + new Date();
            this.callback(ms - this.msFrom);
          }, ms || 1000);
        },
        stop: function () {
          clearInterval(this.id);
          var ms = + new Date();
          this.callback(ms - this.msFrom);
        },
        cancel: function () {
          clearInterval(this.id);
          var ms = + new Date();
          this.callback(ms - this.msFrom);
        }
      }

      return ProcessTimer;
    })();



    var WxRecord = (function () {
      function WxRecord() {
        this.status = 'ready';
        this.localId = null;

        // 录音长度，毫秒
        this.ms = 0;

        // 录音长度更新定时器
        this.timer = new ProcessTimer(ms => {
          this.ms = ms;
        });

        /** 当页面切换时，取消录音 */
        $rootScope.$on('$locationChangeSuccess', function () {
          this.cancel('url changed');
        });
      }

      WxRecord.prototype = {

        /** 开始录音 */
        startRecord: function () {
          if (this.status = 'recording') return $q.reject('recording');
          this.cancel();
          return WxVoiceBase.startRecord().then(wx => {
            this._record_deferred = $q.defer();
            // 录音时间超过一分钟，会自动触发:
            WxVoiceBase.onVoiceRecordEnd().then(res => {
              //alert("录音满1分钟");
              this.recordEnd(res.localId);
            });
            return this._record_deferred.promise;
          });
        },

        /** 手动停止录音 */
        stopRecord: function () {
          WxVoiceBase.stopRecord().then(res => {
            this.recordEnd(res.localId);
          });
        },

        /** 录音完成 */
        recordEnd: function (localId) {
          this.timer.stop();
          this.status = 'done';
          this.localId = localId;
          this._record_deferred.resolve(localId);
        },

        /** 转换为微信服务器音频id */
        toServerId: function () {
          if (!this.localId) return $q.reject('none localId');
          return WxVoiceBase.toServerId(this.localId);
        },

        /** 从微信服务器下载音频 */
        fromServerId: function (serverId) {
          return WxVoiceBase.fromServerId(this.serverId).then(localId => {
            this.localId = res.localId;
            return localId;
          });
        },

        /** 录音取消 */
        cancelRecord: function (reason) {
          this.timer.cancel();
          if (this._record_deferred) {
            this._record_deferred.reject(reason || 'canceled');
          }
        },

        /** 播放录音 */
        playVoice: function () {
          return WxVoiceBase.playVoice(this.localId).then(wx => {
            var deferred = $q.defer();
            WxVoiceBase.onVoicePlayEnd().then(res => {
              if (res.localId == this.localId) {
                deferred.resolve(res.localId);
              }
            });
            return deferred.promise;
          });
        },

        /** 暂停播放录音 */
        pauseVoice: function () {
          return WxVoiceBase.pauseVoice(this.localId);
        },
      }

      return WxRecord;
    })();

  }]);


  theModule.run(['sign', 'WxVoiceBase', function (sign, WxVoiceBase) {

    var WX_VIOCE = {
      record: function () {

      },
      playVoice: function (localId) {
        return WxVoiceBase.playVoice(localId);
      },
      toServerId: function (localId) {
        return WxVoiceBase.toServerId(localId);
      },
      fromServerId: function (ServerId) {
        return WxVoiceBase.fromServerId(ServerId);
      },
    }

    sign.registerHttpHook({
      match: /^WX_VIOCE\/(.*)$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        if (!angular.isArray(param)) param = [param];
        return mockResponse.OK(WX_VIOCE[match[1]].apply({}, param));
      }
    });
  }]);


})(angular, window);
