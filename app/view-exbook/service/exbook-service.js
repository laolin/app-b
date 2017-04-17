'use strict';
(function(){
  
//错误代码和服务器相关。服务器统一整理调整时要一并调整
var
  ERR_EB_INVALID=202002,//内容无效
  ERR_EB_NOTHING=202003,//获取结果为空

  ERR_OK=0;
angular.module('exbook')
.factory('ExbookService', 
['$log','$http','$timeout','$location','AppbData','ExbookCommentService','ExbookToolsService',
function ($log,$http,$timeout,$location,AppbData,ExbookCommentService,ExbookToolsService){
  var svc=this;
  var ebData={draft:{}};//草稿
  var appData=AppbData.getAppData();
  var config=false;

  appData.ebData=ebData;
  appData.ebData.cmtData=ExbookCommentService.getCmtData();
  svc.ebData=ebData;
  
  svc.isUpdating=false;
  svc.dataChanged={ 
    grade:0,
    course:0,
    content:0,
    pics:0,
    anonymous:0
  };

  
  /**
   *  para.count=2~200: 数量
   *  para.oldMore=1: 更多旧帖
   *  para.newMore=1: 更多新帖
   */
  function exploreFeed(para){
    //由于有自动刷新机制，所以这里允许出错次数不能太多
    //否则在网络条件不好时会过多重复调用没有效果的API
    if(countError()>3)return;
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
      //规定 publish时间顺序和 fid排序都是一样的
      if(para.newMore) {
        if(ebData.newMoreLoading)return;
        ebData.newMoreLoading=true;
        pdata.newmore=ebData.feedList[0].fid;
      } else if( para.oldMore) {
        if(ebData.oldMoreLoading)return;
        ebData.oldMoreLoading=true;
        pdata.oldmore=ebData.feedList[ebData.feedList.length-1].fid;
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
        countError(1);
        $log.log('Er:FeedList:',s.data.msg);
        if(s.data.errcode==ERR_EB_NOTHING) { 
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
      
      //获取所有的 s.data.data[i].uid 的用户信息
      ExbookToolsService.requireUsersInfo(s.data.data);
      
      //获取所有fid下的评论
      var fids=fidList(s.data.data);
      $log.log('fids',fids);
      ExbookCommentService.getComment({fids:fids.join(',')});
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
        ebData.hasNewMore=false;
        ebData.newMoreLoading=false;
      } else {
        ebData.feedList=s.data.data;
      }
    },function(e){
      // error
      countError(1);
      if(pdata.newmore)ebData.newMoreLoading=false;
      if(pdata.oldmore)ebData.oldMoreLoading=false;
      $log.log('error at ExbookService-exploreFeed',e);
    })
  }
  function fidList(feeds) {
    var ids=[];
    for(var i=feeds.length;i--; ) {
      if(ids.indexOf(feeds[i]['fid'])<0)ids.push(feeds[i]['fid']);
    }
    return ids;
  }  

  function publish() {
    if(countError()>10)return;
    ebData.publishing=true;
    appData.toastLoading();
    updateData(function(){
      var api=appData.urlSignApi('exbook','draft_publish');
      $log.log('api1',api);
      $http.jsonp(api,{params:{fid:ebData.draft.fid}})
      .then(function(s){
        
        if(s.data.errcode!=0) {
          $log.log('Er:publish:',s.data.errcode,s.data.msg);
          if(s.data.errcode==ERR_EB_INVALID) {
            appData.toastMsg(s.data.msg,7);
          } else {
            appData.toastMsg('Er:publish:',s.data.errcode,s.data.msg,8);
          }
          countError(1);
          ebData.publishing=false;
          return;
        }
        
        //发布成功，把草稿中的 文字、图片 清空，其余不变
        ebData.lastGrade=ebData.draft.grade;
        ebData.lastCourse=ebData.draft.course;
        ebData.draft.content='';//服务器在发布时也清空了
        ebData.draft.pics='';//服务器在发布时也清空了
          
        $location.path( "/explore" );
        if(ebData.feedList.length) {
          ebData.hasNewMore=true;
          exploreFeed({newMore:1});//自动刷新新帖
        }//原先没有任何feed时,跳到/explore后会自己取，故不需要刷新新帖
        appData.toastDone(1);
        ebData.publishing=false;
      },function(e){
        appData.toastMsg('Ejsonp:publish',8);
        countError(1);
        ebData.publishing=false;
      });
    },function(){
      countError(1);
      ebData.publishing=false;
    });
  }
  
  function changeMark(key) {
    svc.dataChanged[key]= 1;// 1表示需要更新
  }

  function updateData(callback,onErr) {
    if(svc.isUpdating) {
      $timeout(function(){updateData(callback,onErr)},500);
      return;
    };
    svc.isUpdating=true;
    //$log.log('updateData',ebData.draft);
    var data={}
    var dirty=false;
    for (var attr in svc.dataChanged) {
      if(1 == svc.dataChanged[attr]) { // 1表示需要更新
        dirty=true;
        data[attr]=ebData.draft[attr];
        svc.dataChanged[attr]=2;//2 表示正在更新中
      }
    }

    if(!dirty) {
      if('function'==typeof callback)callback();
      svc.isUpdating=false;
      return;
    }
    var api=appData.urlSignApi('exbook','draft_update');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
    }
    data.fid=ebData.draft.fid;
    $http.jsonp(api, {params:data})//TODO : 出错处理
      .then(function(s){
         for (var attr in svc.dataChanged) {
          if(2 == svc.dataChanged[attr])// 2 更新成功->0
            svc.dataChanged[attr]=0;                    
        }
        //appData.toastMsg('draft updated',3);
        svc.isUpdating=false;
        if('function'==typeof callback)callback();
      },function(e){
        countError(1);
        for (var attr in svc.dataChanged) {
          if(2 == svc.dataChanged[attr])// 2 更新失败->1
            svc.dataChanged[attr]=1;                    
        }
        appData.toastMsg('draft updated error');
        svc.isUpdating=false;
        if('function'==typeof onErr)onErr();
      })
  }
  
  //删除一条
  function deleteFeed(fid) {
    appData.dialogData.confirmDialog('删除此条',function(){_confirmedDeleteFeed(fid)});
  }
  function _confirmedDeleteFeed(fid) {
    var api=appData.urlSignApi('exbook','feed_delete');
    appData.toastLoading();
    $http.jsonp(api,{params:{fid:fid}})
    .then(function(s){
      if(s.data.errcode!=0) {
        var info='E:DelF:'+s.data.errcode+":"+s.data.msg;
        $log.log(info);
        appData.toastMsg(info,8);
        return;
      }
      
      //删除成功
      for(var i=ebData.feedList.length; i--; ) {
        if(ebData.feedList[i].fid==fid){
          ebData.feedList.splice(i,1);
          //TODO: 服务器端会留下一堆无头的评论，待处理
          break;
        }
      }
      appData.toastDone(1);
    },function(e){
      appData.toastMsg('Ejsonp:DelF',8);
    });

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
        countError(1);
      }
      if(!res.data) {
        appData.toastMsg('Error init draft data',60);
        $log.log('Error init draft data',res);
        countError(1);
      }
      $log.log('Done init draft',res);
      ebData.draft=res.data;
      
    },function(e){
      // error
      countError(1);
      $log.log('error at ExbookService-initDraft',e);
    })
  }
  
  function init_cfg() {
    if(config)return;
    
    var url=appData.urlApi('exbook','config');

    $http.jsonp(url).then(function(d){
      if(d.data.errcode!=0 || ! d.data.data) {
        appData.setDialogData({
          title:'get cfg Data Err!',
          content:JSON.stringify(d.data),
          btn1:'OK',
          show:1
        });
        countError(1);
        return;
      }
      config=d.data.data;
      ebData.ebConfig=config;
    },function(e){
      appData.toastMsg('下载初始化数据失败');
      countError(1);
    });
  }
  var countError =ExbookToolsService.countError;
  
  //
  ebData.initDraft=initDraft;
  ebData.exploreFeed=exploreFeed;
  //更新、发布相关：
  ebData.changeMark=changeMark;
  ebData.updateData=updateData;
  ebData.publish=publish;
  ebData.publishing=false;
  ebData.deleteFeed=deleteFeed;
  
  ebData.feedList=[];
  ebData.usersInfo=ExbookToolsService.getUsersInfoData();//头像等用户信息
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
