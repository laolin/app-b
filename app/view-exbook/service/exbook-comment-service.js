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

  /**
   *  para 是由 <appb-ui-input-bar> 组件传递来的对象
   *  包含必选项：
   *  para.id,代表fid
   *  para.__input,代表content
   *  其他可选：
   */
  function addComment(para){
    $log.log('addComment',para);
    var obj={content:para.__input};
    if(para.re_cid && para.re_uid ){
      obj.re_cid=para.re_cid;
      obj.re_uid=para.re_uid;
    }

    para.__input='';
    _addCommentOrLike(para.id,'comment',obj);
  }
  
  function addLike(fid) {
    _addCommentOrLike(fid,'like')
  }
  
  function _addCommentOrLike(fid,type,obj) {
    if(countError()>10)return;
    if(cmtData.likePublishing)return;
    cmtData.likePublishing=true;
    //appData.toastLoading();
  
    var api=appData.urlSignApi('ebcomment','add',type);
    //$log.log('api1',api,obj);
    $http.jsonp(api,{params:angular.extend({fid:fid},obj)})
    .then(function(s){
      
      if(s.data.errcode!=0) {
        $log.log('Er:ebcomment:',s.data.errcode,s.data.msg);
        if(s.data.errcode==ERR_EBC_INVALID) {
          appData.toastMsg(s.data.msg,7);
        } else {
          appData.toastMsg('Er:ebcomment:',s.data.errcode,s.data.msg,8);
        }
        countError(1);
        cmtData.likePublishing=false;
        return;
      }
      
      //点赞成功
      //appData.toastDone(1);
      getComment({newMore:cmtData.cidMax});
      cmtData.likePublishing=false;
    },function(e){
      appData.toastMsg('Ejsonp:ebcomment',8);
      countError(1);
      cmtData.likePublishing=false;
    });
  
  }

  /**
   *  删除 点赞
   */
  function delLike(fid,cid) {
    delCtype(fid,cid,'like');
  }
  /**
   *  删除 评论
   */
  function delComment(fid,cid) {
    delCtype(fid,cid,'comment');
  }
  /**
   *  删除 点赞/评论
   */
  function delCtype(fid,cid,ctype) {
    var api=appData.urlSignApi('ebcomment','del');
    $http.jsonp(api,{params:{fid:fid,cid:cid,ctype:ctype}})
    .then(function(s){
      if(s.data.errcode!=0) {
        $log.log('Er:del c:',s.data.errcode,s.data.msg);
        if(s.data.errcode==ERR_EBC_INVALID) {
          appData.toastMsg(s.data.msg,7);
        } else {
          appData.toastMsg('Er:del c:',s.data.errcode,s.data.msg,8);
        }
        return;
      }
      //取消点赞成功
      //appData.toastDone(1);
      //本地 相应删除点赞数据：
      var cm=cmtData.commentList[fid+ctype];
      for(var i=cm.length; i-- ; ) {
        if(cm[i].cid==cid) {
          cm.splice(i,1);
          break;
        }
      }
      for(i=cmtData.commentIdList.length; i-- ; ) {
        if(cmtData.commentIdList[i]==cid) {
          cmtData.commentIdList.splice(i,1);
          break;
        }
      }
    },function(e){
      appData.toastMsg('Ejsonp:del c',8);
      countError(1);
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
      pdata.newmore=para.newMore;
    }
    if(para && para.oldMore) {
      pdata.oldmore=para.oldMore;
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
  cmtData.delLike=delLike;
  cmtData.delComment=delComment;
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
