'use strict';
(function(){
  
//错误代码和服务器相关。服务器统一整理调整时要一并调整
var
  ERR_EB_INVALID=202002,//内容无效
  ERR_EB_NOTHING=202003,//获取结果为空

  ERR_OK=0;
angular.module('appb')
.factory('AppbFeedService', 
['$log','$http','$timeout','$location','$q','AppbData','AppbCommentService',
function ($log,$http,$timeout,$location,$q,AppbData,AppbCommentService){
  var svc=this;
  var ebData={draft:{}};//草稿
  var appData=AppbData.getAppData();
  var config=false;

  appData.ebData=ebData;
  appData.ebData.cmtData=AppbCommentService.getCmtData();

  
  svc.isUpdating=false;
  svc.dataChanged={ 
    content:0,
    pics:0
  };
  function feedAppCat(app,cat) {
    return app+'.'+cat;
  }

  function getFeed(fid,app,cat){
    var i;
    var deferred = $q.defer();
    var fcat=feedAppCat(app,cat);
    if(ebData.feedAll[fcat]) {
      for(i=ebData.feedAll[fcat].length;i--; ) {
        if(ebData.feedAll[fcat][i].fid==fid) {//绑定到页面中，不可重赋值
          deferred.resolve(ebData.feedAll[fcat][i]);
          return deferred.promise;
        }
      }
    }
    var api=appData.urlSignApi('feed','get');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject(-1);
      return deferred.promise;
    }
    
    
    return $http.jsonp(api, {params:{fid:fid}})
    .then(function(s){
      if(s.data.errcode!=0) {
        errorCount(1);
        $log.log('Er:getFeed:',s.data.msg);
        deferred.reject(-2);
        return deferred.promise;
      }
      
      //获取所有的 s.data.data.uid 的用户信息
      appData.userData.requireUsersInfo([s.data.data]);
      
      //获取所有fid下的评论
      AppbCommentService.getComment({fids:s.data.data.fid});
      deferred.resolve(s.data.data);
      return deferred.promise;
    },function(e){
      deferred.reject(e);
      return deferred.promise;
    });
  }
  
  /**
   *  para.count=2~200: 数量
   *  para.oldMore=1: 更多旧帖
   *  para.newMore=1: 更多新帖
   */
  function exploreFeed(para){
    //由于有自动刷新机制，所以这里允许出错次数不能太多
    //否则在网络条件不好时会过多重复调用没有效果的API
    if(errorCount()>3)return;
    var i;
    var api=appData.urlSignApi('feed','li');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      return false;
    }
    var pdata={count:10, app:'exbook',cat:'exbook' };
    
    var fcat=feedAppCat(pdata.app,pdata.cat);
    if(!ebData.feedAll[fcat])
      ebData.feedAll[fcat]=[];
    
    // newmore 表示获取新的
    // oldmore 表示获取更多旧的
    if(para && ebData.feedAll[fcat].length) {
      //规定 publish时间顺序和 fid排序都是一样的
      if(para.newMore) {
        if(ebData.newMoreLoading)return;
        ebData.newMoreLoading=true;
        pdata.newmore=ebData.feedAll[fcat][0].fid;
      } else if( para.oldMore) {
        if(ebData.oldMoreLoading)return;
        ebData.oldMoreLoading=true;
        pdata.oldmore=ebData.feedAll[fcat][ebData.feedAll[fcat].length-1].fid;
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
        errorCount(1);
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
      appData.userData.requireUsersInfo(s.data.data);
      
      //获取所有fid下的评论
      var fids=fidList(s.data.data);
      $log.log('fids',fids);
      AppbCommentService.getComment({fids:fids.join(',')});
      //
      if(pdata.oldmore) { //oldMore
        ebData.feedAll[fcat]=ebData.feedAll[fcat].concat(s.data.data);
        ebData.oldMoreLoading=false;
      } else if(pdata.newmore) {//newMore
        //newMore 如果返回 newMoreCount，说明新的很多，
        //新内容和原来的内容在时间没连续的接上，故要扔掉旧的
        if(s.data.data.length==newMoreCount) {
          ebData.feedAll[fcat]=s.data.data;
        } else {
          ebData.feedAll[fcat]=s.data.data.concat(ebData.feedAll[fcat]);
        }
        ebData.hasNewMore=false;
        ebData.newMoreLoading=false;
      } else {
        ebData.feedAll[fcat]=s.data.data;
      }
    },function(e){
      // error
      errorCount(1);
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
    if(errorCount()>10)return;
    ebData.publishing=true;
    appData.toastLoading();
    updateData(function(){
      var api=appData.urlSignApi('feed','draft_publish');
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
          errorCount(1);
          ebData.publishing=false;
          return;
        }
        
        //发布成功，把草稿中的 文字、图片 清空，其余不变
        ebData.draft.content='';//服务器在发布时也清空了
        ebData.draft.pics='';//服务器在发布时也清空了
        var fcat=feedAppCat(ebData.draft.app,ebData.draft.cat);
        $location.path( "/explore" );
        if(ebData.feedAll[fcat].length) {
          ebData.hasNewMore=true;
          exploreFeed({newMore:1});//自动刷新新帖
        }//原先没有任何feed时,跳到/explore后会自己取，故不需要刷新新帖
        appData.toastDone(1);
        ebData.publishing=false;
      },function(e){
        appData.toastMsg('Ejsonp:publish',8);
        errorCount(1);
        ebData.publishing=false;
      });
    },function(){
      errorCount(1);
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
    var api=appData.urlSignApi('feed','draft_update');
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
        errorCount(1);
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
  function deleteFeed(fid,app,cat) {
    appData.dialogData.confirmDialog('删除此条',function(){_confirmedDeleteFeed(fid,app,cat)});
  }
  function _confirmedDeleteFeed(fid,app,cat) {
    var api=appData.urlSignApi('feed','del');
    appData.toastLoading();
    $http.jsonp(api,{params:{fid:fid}})
    .then(function(s){
      if(s.data.errcode!=0) {
        var info='E:DelF:'+s.data.errcode+":"+s.data.msg;
        $log.log(info);
        appData.toastMsg(info,8);
        return;
      }
      
      var fcat=feedAppCat(app,cat);
      
      //删除成功
      for(var i=ebData.feedAll[fcat].length; i--; ) {
        if(ebData.feedAll[fcat][i].fid==fid){
          ebData.feedAll[fcat].splice(i,1);
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
    var api=appData.urlSignApi('feed','draft_init');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      return false;
    }
    $http.jsonp(api, {params:{app:'exbook',cat:'exbook'}})
    .then(function(s){
      var res=s.data;
      if(res.errcode > 0) {
        appData.toastMsg('Error init draft',60);
        $log.log('Error init draft',res);
        errorCount(1);
        return;
      }
      if(!res.data) {
        appData.toastMsg('Error init draft data',60);
        $log.log('Error init draft data',res);
        errorCount(1);
        return;
      }
      $log.log('Done init draft',res);
      ebData.draft=res.data;
      
    },function(e){
      // error
      errorCount(1);
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
        errorCount(1);
        return;
      }
      config=d.data.data;
      ebData.ebConfig=config;
      ebData.valueList={};
      for(var i=config.data_define.length;i--;) {
        ebData.valueList[config.data_define[i].column]=config.data_define[i].data;
      }
    },function(e){
      appData.toastMsg('下载初始化数据失败');
      errorCount(1);
    });
  }
  var errorCount =appData.errorCount;
  
  //
  ebData.initDraft=initDraft;
  ebData.getFeed=getFeed;
  ebData.exploreFeed=exploreFeed;
  //更新、发布相关：
  ebData.changeMark=changeMark;
  ebData.updateData=updateData;
  ebData.publish=publish;
  ebData.publishing=false;
  ebData.feedAppCat=feedAppCat;
  ebData.deleteFeed=deleteFeed;
  
  ebData.feedAll={};//feedList
  ebData.usersInfo=appData.userData.usersInfo;//头像等用户信息
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
