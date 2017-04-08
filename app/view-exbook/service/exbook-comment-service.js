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
['$log','$http','$timeout','$location','AppbData','ExbookToolsService',
function ($log,$http,$timeout,$location,AppbData,ExbookToolsService){
  var svc=this;
  var cmtData={};
  var appData=AppbData.getAppData();
  var config=false;

  svc.cmtData=cmtData;


  function addComment(para){
  }
  
  function addLike(fid) {
    if(countError()>10)return;
    if(cmtData.likePublishing)return;
    cmtData.likePublishing=true;
    appData.toastLoading();
  
    var api=appData.urlSignApi('ebcomment','add','like');
    $log.log('api1',api);
    $http.jsonp(api,{params:{fid:fid}})
    .then(function(s){
      
      if(s.data.errcode!=0) {
        $log.log('Er:ebcomment:',s.data.errcode,s.data.msg);
        if(s.data.errcode==ERR_EB_INVALID) {
          appData.toastMsg(s.data.msg,7);
        } else {
          appData.toastMsg('Er:ebcomment:',s.data.errcode,s.data.msg,8);
        }
        countError(1);
        cmtData.likePublishing=false;
        return;
      }
      
      //点赞成功
      appData.toastDone(1);
      getComment({newMore:cmtData.cidMax});
      cmtData.likePublishing=false;
    },function(e){
      appData.toastMsg('Ejsonp:ebcomment',8);
      countError(1);
      cmtData.likePublishing=false;
    });
  
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
 
    if(para && para.newMore) {
      pdata.newmoew=para.newMore;
    }
    if(para && para.oldMore) {
      pdata.oldmoew=para.oldMore;
    }
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
      var cm=s.data.data;
      var rquids=[];
      var cid;
      for(i=0;i<cm.length;i++) {
        cid = + cm[i].cid//转为数字，否则字符串比较9比10大
        if(cid<cmtData.cidMin)cmtData.cidMin=cid;
        if(cid>cmtData.cidMax)cmtData.cidMax=cid;
        if(cmtData.commentIdList.indexOf(cid)>=0)return;//已有的数据
        cmtData.commentIdList.push(cid);
        if(!cmtData.commentList[cm[i].fid+'comment']) {
          cmtData.commentList[cm[i].fid+'comment']=[];
        }
        if(!cmtData.commentList[cm[i].fid+'like']) {
          cmtData.commentList[cm[i].fid+'like']=[];
        }
        cmtData.commentList[cm[i].fid+cm[i].ctype].push(cm[i]);
        rquids.push({uid:cm[i].uid},{uid:cm[i].re_uid});
      }

      //获取所有 需要 的用户信息
      ExbookToolsService.requireUsersInfo(rquids);
      
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
  
  
  var countError =ExbookToolsService.countError;

  
  //
  cmtData.getComment=getComment;
  cmtData.addComment=addComment;
  cmtData.addLike=addLike;
  //更新、发布相关：
  
  cmtData.commentList={};
  cmtData.commentIdList=[];
  cmtData.cidMax=0;//保存已获得的cid 的最大最小范围
  cmtData.cidMin=9e99;//保存已获得的cid 的最大最小范围



  return {
    getCmtData:function(){return cmtData;},
    addComment:addComment,
    getComment:getComment
  }
         
}]);

//___________________________________
})();
