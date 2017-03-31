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
    
    // newmore 表示获取新的
    // oldmore 表示获取更多旧的
    if(para && ebData.feedList.length) {
      //假定服务器返回的时间顺序都是正常的
      // 目前也假定没有发布时间是在同 一秒  的 ( TODO: 这个有问题 )
      if(para.newMore) {
        if(ebData.newMoreLoading)return;
        ebData.newMoreLoading=true;
        pdata.newmore=ebData.feedList[0].publish_at;
      } else if( para.oldMore) {
        if(ebData.oldMoreLoading)return;
        ebData.oldMoreLoading=true;
        pdata.oldmore=ebData.feedList[ebData.feedList.length-1].publish_at;
      }
    }
    if(para && para.count) {
      pdata.count=para.count;
    }
    
    //newMore的一律刷200条
    var newMoreCount=200;
    if(pdata.newmore) {
      pdata.count=newMoreCount;
    }
    $log.log('exploreFeed',para,pdata);
    
    $http.jsonp(api, {params:pdata})
    .then(function(s){
      if(s.data.errcode!=0) {
        $log.log('Er:FeedList:',s.data.msg);
        if(s.data.errcode==10) { // 10 和服务器相关。服务器统一整理调整时要一并调整
          //appData.toastMsg('已没有更多',3);
          if(pdata.newmore) {
            ebData.hasNewMore=false;
          }
          if(pdata.oldmore) {
            ebData.hasOldMore=false;
          }
        }
        if(pdata.newmore) ebData.newMoreLoading=false;
        if(pdata.oldmore) ebData.oldMoreLoading=false;
        return;
      }
      
      //
      if(pdata.oldmore) { //oldMore
        ebData.feedList=ebData.feedList.concat(s.data.data);
        ebData.oldMoreLoading=false;
      } else if(pdata.newmore) {//newMore
        //newMore 如果返回 newMoreCount，说明新的很多，
        //新内容和原来的内容在时间没连续的接上，故要扔掉旧的
        if(s.data.data.length==newMoreCount) {
          ebData.feedList=s.data.data;
        } else {
          ebData.feedList=s.data.data.concat(ebData.feedList);
        }
        ebData.newMoreLoading=false;
      } else {
        ebData.feedList=s.data.data;
      }
    },function(e){
      // error
      if(pdata.newmore)ebData.newMoreLoading=false;
      if(pdata.oldmore)ebData.oldMoreLoading=false;
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
  ebData.newMoreLoading=false;
  ebData.oldMoreLoading=false;
  ebData.hasNewMore=false;
  ebData.hasOldMore=true;
  initDraft();
  init_cfg();


  return {
    getEbData:function(){return ebData}
  }
         
}]);

//___________________________________
})();
