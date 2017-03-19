'use strict';
(function(){

angular.module('exbook')
.factory('ExbookService', 
['$log','$http','$timeout','AppbData',
function ($log,$http,$timeout,AppbData){
  var svc=this;
  var ebData={draft:{}};//草稿
  var appData=AppbData.getAppData();
  var config=false;

  appData.ebData=ebData;
  svc.ebData=ebData;
  
  function initDraft() {
    var api=appData.urlSignApi('exbook','draft_create');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      return false;
    }
    $http.jsonp(api, {params:{}})//TODO : 出错处理
    .then(function(s){
      var res=s.data;
      if(res.errcode > 0) {
        appData.toastMsg('Error init draft',60);
        $log.log('Error init draft',res);
      }
      if(!res.data) {
        appData.toastMsg('Error init draft data',60);
        $log.log('Error init draft data',res);
      }
      $log.log('Done init draft',res);
      ebData.draft=res.data;
      
      ebData.imgData={
        title:'题目', maxCount:9, imgs:[ ], serverIds:[], apiFileIds:[]
      };
    },function(e){
      // error
      $log.log('error at ExbookService-initDraft',e);
    })
  }
  initDraft();
  
  init_cfg();
  function init_cfg() {
    if(config)return;
    
    var url=appData.appCfg.apiRoot+'/eb_common/config?';
    var qstr=appData.userApiSignQueryStr('eb_common','config');
    url+=qstr;

    $http.jsonp(url).then(function(d){
      if(d.data.errcode!=0 || ! d.data.data) {
        appData.setDialogData({
          title:'get cfg Data Err!',
          content:JSON.stringify(d.data),
          btn1:'OK',
          show:1
        });
        return;
      }
      config=d.data.data;
      ebData.ebConfig=config;
    },function(e){
      appData.toastMsg('下载初始化数据失败');
    });
  }

  return {
    getEbData:function(){return ebData}
  }
         
}]);

//___________________________________
})();
