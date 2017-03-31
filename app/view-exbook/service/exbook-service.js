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
  
  
  /**
   *  para.count=2~200: 数量
   *  para.oldMore=1: 更多旧帖
   *  para.newMore=1: 更多新帖
   */
  function exploreFeed(para){
    var i;
    var api=appData.urlSignApi('exbook','feed_list');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      return false;
    }
    var pdata={count:10};
    if(para && para.count) {
      pdata.before=para.count;
    }
    
    // after 表示获取新的
    // before 表示获取更多旧的
    if(para && ebData.feedList.length) {
      //假定服务器返回的时间顺序都是正常的
      // 目前也假定没有发布时间是在同 一秒  的 ( TODO: 这个有问题 )
      if(para.newMore) {
        pdata.after=ebData.feedList[0].publish_at;
      } else if( para.oldMore) {
        pdata.before=ebData.feedList[ebData.feedList.length-1].publish_at;
      }
    }
    $log.log('exploreFeed',para,pdata);
    
    $http.jsonp(api, {params:pdata})
    .then(function(s){
      if(s.data.errcode!=0) {
        $log.log('Er:FeedList:',s.data.msg);
        if(s.data.errcode==10) { // 10 和服务器相关。服务器统一整理调整时要一并调整
          //appData.toastMsg('已没有更多',3);
          ebData.hasMore=false;
        }
        return;
      }
      
      //
      if(pdata.before) { //oldMore
        ebData.feedList=ebData.feedList.concat(s.data.data);
      } else if(pdata.after) {//newMore
        ebData.feedList=s.data.data.concat(ebData.feedList);
      } else {
        ebData.feedList=s.data.data;
      }
    },function(e){
      // error
      $log.log('error at ExbookService-exploreFeed',e);
    })
  }
  
  function initDraft() {
    var api=appData.urlSignApi('exbook','draft_create');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      return false;
    }
    $http.jsonp(api, {params:{}})
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
    },function(e){
      // error
      $log.log('error at ExbookService-initDraft',e);
    })
  }
  
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
  
  //
  ebData.initDraft=initDraft;
  ebData.exploreFeed=exploreFeed;
  ebData.feedList=[];
  ebData.hasMore=true;
  initDraft();
  init_cfg();


  return {
    getEbData:function(){return ebData}
  }
         
}]);

//___________________________________
})();
