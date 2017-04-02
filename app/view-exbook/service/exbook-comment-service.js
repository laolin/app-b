'use strict';
(function(){
  
//错误代码和服务器相关。服务器统一整理调整时要一并调整
var
  ERR_EB_NOTHING=202003,//获取结果为空
  
  ERR_EBC_TYPE=203501, //无效评论类型
  ERR_EBC_INVALID=203502,//类型内容无效

  ERR_OK=0;
angular.module('exbook')
.factory('ExbookCommentService', 
['$log','$http','$timeout','$location','AppbData',
function ($log,$http,$timeout,$location,AppbData){
  var svc=this;
  var cmtData={};
  var appData=AppbData.getAppData();
  var config=false;

  appData.cmtData=cmtData;
  svc.cmtData=cmtData;


  function addComment(para){
  }

  /**
   *  para.count=2~200: 数量
   *  para.page=1,2: 从1开始计数的页码
   *  para.oldMore=1: 更多旧帖
   *  para.newMore=1: 更多新帖
   *  para.fids=[x,x,x,...]
   */
  function getComment(para){
    if(countError()>10) {
      $log.log('Too many errors @getComment');
      return;
    }
    var i;
    var api=appData.urlSignApi('ebcomment','li');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      return false;
    }
    var pdata={count:200};
 
    if(para && para.count) {
      pdata.count=para.count;
    }
    if(para && para.page) {
      pdata.page=para.page;
    }
    if(para && para.fids) {
      pdata.fids=para.fids;
    }
    
    $log.log('getComment',para,pdata);
    
    $http.jsonp(api, {params:pdata})
    .then(function(s){
      if(s.data.errcode!=0) {
        $log.log('Er:getComment:',s.data.msg);
        if(s.data.errcode==ERR_EB_NOTHING) { 
          //appData.toastMsg('已没有更多',3);
          //s1，没有更多的评论，才算完成
          return;
        }
        countError(1);
        //s2，有错等几秒重试
        $timeout(function(){getComment(para)},8000);
        return;
      }
      
      //
      cmtData.commentList=cmtData.commentList.concat(s.data.data);
      //s3，没有错，返回满页，也要继续取下一页评论
      if(pdata.count == s.data.data.length) {
        var page=para.page;
        if(!page) page=1;
        para.page=++page;
        getComment(para);
      }
    },function(e){
      // error
      countError(1);
      //s4，有错等几秒重试
      $timeout(function(){getComment(para)},8000);
      $log.log('error at getComment',e);
    })
  }
  
  
  /**
   *  计算出错次数，避免网络不好出错后继续频繁刷新
   *  
   *  n : true值  => 加一次出错
   *  n : false值 => 直接返回出错次数
   *  记录上次出错时间，每秒出错次数 -1
   */
  function countError(n) {
    var now=+new Date();
    var last=cmtData.lastError.time;
    //每秒出错次数 -1
    cmtData.lastError.count -= (now-last)/1000;//js不是整数也可以 ++  不用Math.floor
    cmtData.lastError.count = Math.max(0,cmtData.lastError.count);
    if(n) {
      cmtData.lastError.count++;
      cmtData.lastError.time = now;
    }
    
    return cmtData.lastError.count;
  }
  
  //
  cmtData.getComment=getComment;
  cmtData.addComment=addComment;
  //更新、发布相关：
  
  cmtData.commentList=[];
  cmtData.lastError={count:0,time:+new Date()}



  return {
    addComment:addComment,
    getComment:getComment
  }
         
}]);

//___________________________________
})();
