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
  var feedData={};
  var feedDefinition={};
  var appData=AppbData.getAppData();

  appData.feedData=feedData;
  appData.feedData.cmtData=AppbCommentService.getCmtData();

  
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
    if(feedData.feedAll[fcat]) {
      for(i=feedData.feedAll[fcat].length;i--; ) {
        if(feedData.feedAll[fcat][i].fid==fid) {//绑定到页面中，不可重赋值
          deferred.resolve(feedData.feedAll[fcat][i]);
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
    if(!feedData.feedAll[fcat])
      feedData.feedAll[fcat]=[];
    
    // newmore 表示获取新的
    // oldmore 表示获取更多旧的
    if(para && feedData.feedAll[fcat].length) {
      //规定 publish时间顺序和 fid排序都是一样的
      if(para.newMore) {
        if(feedData.newMoreLoading)return;
        feedData.newMoreLoading=true;
        pdata.newmore=feedData.feedAll[fcat][0].fid;
      } else if( para.oldMore) {
        if(feedData.oldMoreLoading)return;
        feedData.oldMoreLoading=true;
        pdata.oldmore=feedData.feedAll[fcat][feedData.feedAll[fcat].length-1].fid;
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
            feedData.hasNewMore=false;
          }
          if(pdata.oldmore) {
            feedData.hasOldMore=false;
          }
        }
        if(pdata.newmore) feedData.newMoreLoading=false;
        if(pdata.oldmore) feedData.oldMoreLoading=false;
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
        feedData.feedAll[fcat]=feedData.feedAll[fcat].concat(s.data.data);
        feedData.oldMoreLoading=false;
      } else if(pdata.newmore) {//newMore
        //newMore 如果返回 newMoreCount，说明新的很多，
        //新内容和原来的内容在时间没连续的接上，故要扔掉旧的
        if(s.data.data.length==newMoreCount) {
          feedData.feedAll[fcat]=s.data.data;
        } else {
          feedData.feedAll[fcat]=s.data.data.concat(feedData.feedAll[fcat]);
        }
        feedData.hasNewMore=false;
        feedData.newMoreLoading=false;
      } else {
        feedData.feedAll[fcat]=s.data.data;
      }
    },function(e){
      // error
      errorCount(1);
      if(pdata.newmore)feedData.newMoreLoading=false;
      if(pdata.oldmore)feedData.oldMoreLoading=false;
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

  function publish(app,cat) {
    if(errorCount()>10)return;
    var fcat=feedAppCat(app,cat);
    var drft=feedData.draftAll[fcat];
    if(!drft)return initDraft(app,cat);
    feedData.publishing=true;
    appData.toastLoading();
    updateData(app,cat,function(){
      var api=appData.urlSignApi('feed','draft_publish');
      $log.log('api1',api);
      $http.jsonp(api,{params:{fid:drft.fid}})
      .then(function(s){
        
        if(s.data.errcode!=0) {
          $log.log('Er:publish:',s.data.errcode,s.data.msg);
          if(s.data.errcode==ERR_EB_INVALID) {
            appData.toastMsg(s.data.msg,7);
          } else {
            appData.toastMsg('Er:publish:',s.data.errcode,s.data.msg,8);
          }
          errorCount(1);
          feedData.publishing=false;
          return;
        }
        
        //发布成功，把草稿中的 文字、图片 清空，其余不变
        drft.content='';//服务器在发布时也清空了
        drft.pics='';//服务器在发布时也清空了
        $location.path( "/explore" );
        if(feedData.feedAll[fcat].length) {
          feedData.hasNewMore=true;
          exploreFeed({newMore:1});//自动刷新新帖
        }//原先没有任何feed时,跳到/explore后会自己取，故不需要刷新新帖
        appData.toastDone(1);
        feedData.publishing=false;
      },function(e){
        appData.toastMsg('Ejsonp:publish',8);
        errorCount(1);
        feedData.publishing=false;
      });
    },function(){
      errorCount(1);
      feedData.publishing=false;
    });
  }
  
  function changeMark(key) {
    svc.dataChanged[key]= 1;// 1表示需要更新
  }

  function updateData(app,cat,callback,onErr) {
    var deferred = $q.defer();
    var fcat=feedAppCat(app,cat);

    if(svc.isUpdating) {
      return $timeout(function(){return updateData(app,cat,callback,onErr)},500);
    };
    svc.isUpdating=true;
    var data={}
    var dirty=false;
    for (var attr in svc.dataChanged) {
      if(1 == svc.dataChanged[attr]) { // 1表示需要更新
        dirty=true;
        data[attr]=feedData.draftAll[fcat][attr];
        svc.dataChanged[attr]=2;//2 表示正在更新中
      }
    }

    if(!dirty) {
      if('function'==typeof callback)callback();
      svc.isUpdating=false;
      deferred.resolve(1);
      return deferred.promise;
    }
    var api=appData.urlSignApi('feed','draft_update');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
    }
    data.fid=feedData.draftAll[fcat].fid;
    return $http.jsonp(api, {params:data})//TODO : 出错处理
      .then(function(s){
         for (var attr in svc.dataChanged) {
          if(2 == svc.dataChanged[attr])// 2 更新成功->0
            svc.dataChanged[attr]=0;                    
        }
        svc.isUpdating=false;
        if('function'==typeof callback)callback();
        deferred.resolve(s);
        return deferred.promise;
      },function(e){
        errorCount(1);
        for (var attr in svc.dataChanged) {
          if(2 == svc.dataChanged[attr])// 2 更新失败->1
            svc.dataChanged[attr]=1;                    
        }
        appData.toastMsg('draft_update error');
        svc.isUpdating=false;
        if('function'==typeof onErr)onErr();
        deferred.reject(e);
        return deferred.promise;
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
      for(var i=feedData.feedAll[fcat].length; i--; ) {
        if(feedData.feedAll[fcat][i].fid==fid){
          feedData.feedAll[fcat].splice(i,1);
          //TODO: 服务器端会留下一堆无头的评论，待处理
          break;
        }
      }
      appData.toastDone(1);
    },function(e){
      appData.toastMsg('Ejsonp:DelF',8);
    });

  }
  
  function initDraft(app,cat) {
    var deferred = $q.defer();

    var api=appData.urlSignApi('feed','draft_init');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject('requireLogin');
      return deferred.promise;
    }
    $http.jsonp(api, {params:{app:app,cat:cat}})
    .then(function(s){
      var res=s.data;
      if(res.errcode > 0) {
        appData.toastMsg('Error init_draft',60);
        $log.log('Error init_draft',res);
        errorCount(1);
        deferred.reject('Error init_draft');
        return deferred.promise;
      }
      if(!res.data) {
        appData.toastMsg('Error draft_data',60);
        $log.log('Error draft_data',res);
        errorCount(1);
        deferred.reject('Error draft_data');
        return deferred.promise;
      }
      $log.log('Done init_draft',res);
      feedData.draftAll[feedAppCat(app,cat)]=res.data;
      deferred.resolve(res.data);
      return deferred.promise;
    },function(e){
      // error
      errorCount(1);
      $log.log('error at ExbookService-initDraft',e);
      deferred.reject(e);
      return deferred.promise;
    })
  }
  
  
    
/* 
[
{name: 'content',desc:'内容'},
{name: 'pics',desc:'图片'},
{name: 'position',desc:'地址'},
{name: 'url',desc:'网址'},
  {
    name: 'd1',//d1~d4,attr,要和数据表的列名对应
    desc: '年级',
    type: 'radio',
    keys: ['x0','x1','x2','x3','x4','x5','x6'],
    values: ['幼升小','一年级','二年级','三年级','四年级','五年级/小升初','初中以上']
  },
  {
    name: 'd2',//d1~d4,attr,要和数据表的列名对应
    desc: '科目',
    type: 'radio',
    keys: ['yu','shu','ying','other'],
    values: ['语文','数学','英语','其他']
  }
]*/
  function defineFeed(app,cat,desc,columns) {
    feedDefinition[feedAppCat(app,cat)]={desc:desc,columns:columns};
  }
  function getFeedDefinition(app,cat) {
    return feedDefinition[feedAppCat(app,cat)];
  }
  function getFeedDefinitionValue(app,cat,name,key) {
    var df = feedDefinition[feedAppCat(app,cat)].columns;
    for(var i= df.length ; i-- ; ) {
      if(df[i].name==name) {
        for(var j= df[i].keys.length ; j-- ; ) {
          if(df[i].keys[j]==key) {
            return df[i].values[j];
          }
        }
      }
    }
    return false;
  }

  
  
  
  
  
  
  
  var errorCount =appData.errorCount;
  
  //
  feedData.initDraft=initDraft;
  feedData.getFeed=getFeed;
  feedData.exploreFeed=exploreFeed;
  //更新、发布相关：
  feedData.changeMark=changeMark;
  feedData.updateData=updateData;
  feedData.publish=publish;
  feedData.publishing=false;
  feedData.feedAppCat=feedAppCat;
  feedData.deleteFeed=deleteFeed;
  
  feedData.draftAll={};//_draft
  feedData.feedAll={};//feedList
  feedData.feedDefinition=feedDefinition;//init by defineFeed()
  feedData.defineFeed=defineFeed;
  feedData.getFeedDefinition=getFeedDefinition;
  feedData.getFeedDefinitionValue=getFeedDefinitionValue;

  feedData.usersInfo=appData.userData.usersInfo;//头像等用户信息
  feedData.newMoreLoading=false;
  feedData.oldMoreLoading=false;
  feedData.hasNewMore=false;
  feedData.hasOldMore=true;




  return {
    getFeedData:function(){return feedData}
  }
         
}]);

//___________________________________
})();
