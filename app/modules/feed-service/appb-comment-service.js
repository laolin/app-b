'use strict';
(function(){
  
//错误代码和服务器相关。服务器统一整理调整时要一并调整
var
  ERR_EB_NOTHING=202003,//获取结果为空
  
  ERR_EBC_TYPE=203501, //无效评论类型
  ERR_EBC_INVALID=203502,//类型内容无效

  ERR_OK=0;
angular.module('appb')
.factory('AppbCommentService', 
['$log','$http','$timeout','$location','AppbData',
function ($log,$http,$timeout,$location,AppbData){
  var svc=this;
  var cmtData={};
  var appData=AppbData.getAppData();
  var userData=appData.userData;
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


  function errorJson(json) {
    if (json.errcode) {
      $log.log('Er:ebcomment:', json.errcode, json.msg);
      if (json.errcode == ERR_EBC_INVALID) {
        appData.toastMsg(json.msg, 7);
      } else {
        appData.toastMsg('Er:ebcomment:', json.errcode, json.msg, 8);
      }
    }
    return json.errcode;
  }

  function _addCommentOrLike(fid,type,obj) {
    if(errorCount()>10)return;
    if(cmtData.likePublishing)return;
    cmtData.likePublishing=true;
    //appData.toastLoading();

    return $http.post("comment/add", angular.extend({ fid: fid }, obj)) //, {signType:'single'})
      .then(json => {
        //点赞/评论 成功
        //appData.toastDone(1);

        //这几行comment倒过来依赖feed，不是很好，先将就
        //以后comment和feed会合并为同一数据表
        var feed = appData.feedData.feedByFid[fid];
        var fids = appData.feedData.theFeedIdList(feed.app, feed.cat);

        getComment({ newMore: cmtData.cidMax, fids: fids.join(',') });
        cmtData.likePublishing = false;
        return json.data;
      })
      .catch(json => {
        errorCount(1);
        cmtData.likePublishing = false;
        if (!errorJson(json)) {
          appData.toastMsg('Ejsonp($http):ebcomment', 8);
        }
        return $q.reject(json);
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


    return $http.post("comment/del", { fid: fid, cid: cid, ctype: ctype }) //, {signType:'single'})
      .then(json => {
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
        for(var i=cmtData.commentIdList.length; i-- ; ) {
          if(cmtData.commentIdList[i]==cid) {
            cmtData.commentIdList.splice(i,1);
            break;
          }
        }
        return json.data;
      })
      .catch(json => {
        errorCount(1);
        if (!errorJson(json)) {
          appData.toastMsg('Ejsonp($http):ebcomment', 8);
        }
        return $q.reject(json);
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
    if(errorCount()>10) {
      $log.log('Too many errors @getComment');
      return;
    }
    var pdata = { count: 200 };
    if (para && para.newMore) {
      pdata.newmore = para.newMore;
    }
    if (para && para.oldMore) {
      pdata.oldmore = para.oldMore;
    }
    if (para && para.count) {
      pdata.count = para.count;
    }
    if (para && para.page) {
      pdata.page = para.page;
    }
    if (para && para.fids) {
      pdata.fids = para.fids;
    }
    $log.log('getComment', para, pdata);

    return $http.post("comment/li", pdata) //, {signType:'single'})
    .then( json => {
      var cm = json.data;
      var rquids = [];
      var cid;
      for (var i = 0; i < cm.length; i++) {
        cid = + cm[i].cid//转为数字，否则字符串比较9比10大
        if (cid < cmtData.cidMin) cmtData.cidMin = cid;
        if (cid > cmtData.cidMax) cmtData.cidMax = cid;
        if (cmtData.commentIdList.indexOf(cid) >= 0) return;//已有的数据
        cmtData.commentIdList.push(cid);
        if (!cmtData.commentList[cm[i].fid + 'comment']) {
          cmtData.commentList[cm[i].fid + 'comment'] = [];
        }
        if (!cmtData.commentList[cm[i].fid + 'like']) {
          cmtData.commentList[cm[i].fid + 'like'] = [];
        }
        cmtData.commentList[cm[i].fid + cm[i].ctype].push(cm[i]);
        rquids.push({ uid: cm[i].uid }, { uid: cm[i].re_uid });
      }

      //获取所有 需要 的用户信息
      userData.requireUsersInfo(rquids);

      //s3，没有错，返回满页，也要继续取下一页评论
      if (pdata.count == json.data.length) {
        var page = para.page;
        if (!page) page = 1;
        para.page = ++page;
        getComment(para);
      }
      return json.data;
    })
    .catch( json =>{
      errorCount(1);
      $timeout(function () { getComment(para) }, 8000);
      // if (!errorJson(json)) {
      //   appData.toastMsg('Ejsonp($http):ebcomment', 8);
      // }
      return $q.reject(json);
    });
  }
  
  
  var errorCount =appData.errorCount;

  
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
