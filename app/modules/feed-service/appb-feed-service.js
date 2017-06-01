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
  function feedAppCat(app,cat) {
    return app+'.'+cat;
  }

  function getFeed(app,cat,fid){
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
      if(s.data.data.attr)
        s.data.data.attr=JSON.parse(s.data.data.attr);
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
  function exploreFeed(app,cat,para){
    var deferred = $q.defer();
    //由于有自动刷新机制，所以这里允许出错次数不能太多
    //否则在网络条件不好时会过多重复调用没有效果的API
    if(errorCount()>3){
      deferred.reject(-1);
      return deferred.promise;
    }
    var i;
    var api=appData.urlSignApi('feed','li');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject(-2);
      return deferred.promise;
    }
    var pdata={count:10, app:app, cat:cat};
    
    var fcat=feedAppCat(pdata.app,pdata.cat);
    if(!feedData.feedAll[fcat])
      feedData.feedAll[fcat]=[];
    
    // newmore 表示获取新的
    // oldmore 表示获取更多旧的
    if(para && feedData.feedAll[fcat].length) {
      //规定 publish时间顺序和 fid排序都是一样的
      if(para.newMore) {
        if(feedData.newMoreLoading[fcat]){
          deferred.reject('Err_newMoreLoading');
          return deferred.promise;
        }
        feedData.newMoreLoading[fcat]=true;
        pdata.newmore=feedData.feedAll[fcat][0].fid;
      } else if( para.oldMore) {
        if(feedData.oldMoreLoading[fcat]){
          deferred.reject('Err_oldMoreLoading');
          return deferred.promise;
        }
        feedData.oldMoreLoading[fcat]=true;
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
    
    return $http.jsonp(api, {params:pdata})
    .then(function(s){
      if(s.data.errcode!=0) {
        errorCount(1);
        $log.log('Er:FeedList:',s.data.msg);
        if(s.data.errcode==ERR_EB_NOTHING) { 
          //appData.toastMsg('已没有更多',3);
          if(pdata.newmore) {
            feedData.hasNewMore[fcat]=false;
          }
          if(pdata.oldmore) {
            feedData.hasOldest[fcat]=true;
          }
        }
        if(pdata.newmore) feedData.newMoreLoading[fcat]=false;
        if(pdata.oldmore) feedData.oldMoreLoading[fcat]=false;
        //这里不能reject?
        //deferred.reject('Er:FeedList:'+s.data.msg);
        deferred.resolve(false);
        return deferred.promise;
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
        feedData.oldMoreLoading[fcat]=false;
      } else if(pdata.newmore) {//newMore
        //newMore 如果返回 newMoreCount，说明新的很多，
        //新内容和原来的内容在时间没连续的接上，故要扔掉旧的
        if(s.data.data.length==newMoreCount) {
          feedData.feedAll[fcat]=s.data.data;
        } else {
          feedData.feedAll[fcat]=s.data.data.concat(feedData.feedAll[fcat]);
        }
        feedData.hasNewMore[fcat]=false;
        feedData.newMoreLoading[fcat]=false;
      } else {
        feedData.feedAll[fcat]=s.data.data;
      }
      var dlist=s.data.data;
      for(i=dlist.length;i--;i) {
        if(dlist[i].attr) {
          dlist[i].attr=JSON.parse(dlist[i].attr);
        }
      }
      deferred.resolve(feedData.feedAll[fcat]);
      return deferred.promise;
    },function(e){
      // error
      errorCount(1);
      if(pdata.newmore)feedData.newMoreLoading[fcat]=false;
      if(pdata.oldmore)feedData.oldMoreLoading[fcat]=false;
      $log.log('error at ExbookService-exploreFeed',e);
      deferred.reject(e);
      return deferred.promise;
    })
  }
  function fidList(feeds) {
    var ids=[];
    for(var i=feeds.length;i--; ) {
      if(ids.indexOf(feeds[i]['fid'])<0)ids.push(feeds[i]['fid']);
    }
    return ids;
  }  

  function publish(app,cat,feedFullObj,dataChanged) {
    var deferred = $q.defer();
    if(errorCount()>10) {
      deferred.reject('too many errors');
      return deferred.promise;
    }
    var fcat=feedAppCat(app,cat);
    var drft=feedData.draftAll[fcat];
    if(!drft){
      deferred.reject('need initDraft first:'+app+','+cat);
      return deferred.promise;
    }
    feedData.publishing=true;
    appData.toastLoading();
    return updateDraft(app,cat,feedFullObj,dataChanged)
    .then(function(){
      var api=appData.urlSignApi('feed','draft_publish');
      $log.log('api1',api);
      return $http.jsonp(api,{params:{fid:drft.fid}})
    },function(){
      errorCount(1);
      feedData.publishing=false;
      deferred.reject('Err updata before pub');
      return deferred.promise;
    })
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
        deferred.reject(s);
        return deferred.promise;
      }
      
      //发布成功，把草稿中的 文字、图片 清空，其余不变
      drft.content='';//服务器在发布时也清空了
      drft.pics='';//服务器在发布时也清空了
      
      
      appData.toastDone(1);
      feedData.publishing=false;
      deferred.resolve(s);
      return deferred.promise;
    },function(e){
      appData.toastMsg('Ejsonp:publish',8);
      errorCount(1);
      feedData.publishing=false;
      deferred.reject(e);
      return deferred.promise;
    });
  }
  

  function updateDraft(app,cat,feedFullObj,dataChanged) {
    $log.log('updateDraft->>',feedFullObj,dataChanged);
    var deferred = $q.defer();
    var fcat=feedAppCat(app,cat);

    if(svc.isUpdating) {
      return $timeout(function(){return updateDraft(app,cat,feedFullObj,dataChanged)},500);
    };
    svc.isUpdating=true;
    var data={}
    var data_attr=false;
    var dirty=false;
    for (var key in dataChanged) {
      if(1 == dataChanged[key]) { // 1表示需要更新
        dirty=true;
        //处理attr.xxx，属于下一级数据列的情况
        if(key.substr(0,5)=='attr_') {
          if(!data_attr)data_attr={}
          data_attr[key.substr(5)]=feedFullObj.attr[key.substr(5)];
        } else {
          data[key]=feedFullObj[key];
        }
        dataChanged[key]=2;//2 表示正在更新中
      }
    }
    if(data_attr) {
      data.attr=JSON.stringify(data_attr);
    }

    if(!dirty) {
      svc.isUpdating=false;
      deferred.resolve(1);
      return deferred.promise;
    }
    var api=appData.urlSignApi('feed','draft_update');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject('need login');
      return deferred.promise;
    }
    data.fid=feedFullObj.fid;
    return $http.jsonp(api, {params:data})//TODO : 出错处理
      .then(function(s){
         for (var attr in dataChanged) {
          if(2 == dataChanged[attr])// 2 更新成功->0
            dataChanged[attr]=0;                    
        }
        svc.isUpdating=false;
        deferred.resolve(s);
        return deferred.promise;
      },function(e){
        errorCount(1);
        for (var attr in dataChanged) {
          if(2 == dataChanged[attr])// 2 更新失败->1
            dataChanged[attr]=1;                    
        }
        appData.toastMsg('draft_update error');
        svc.isUpdating=false;
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
    if(feedData.draftAll[feedAppCat(app,cat)]) {
      deferred.resolve(feedData.draftAll[feedAppCat(app,cat)]);
      return deferred.promise;
    }

    var api=appData.urlSignApi('feed','draft_init');
    if(!api){
      appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
      deferred.reject('requireLogin');
      return deferred.promise;
    }
    return $http.jsonp(api, {params:{app:app,cat:cat}})
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
      if(res.data.attr)res.data.attr=JSON.parse(res.data.attr);
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
  function getFeedDefinitionType(app,cat,name) {
    var df = feedDefinition[feedAppCat(app,cat)].columns;
    for(var i= df.length ; i-- ; ) {
      if(df[i].name==name) {
        return df[i].type
      }
      return '';
    }
    return '';
  }
  function getFeedDefinitionValue(app,cat,name,key) {
    var df = feedDefinition[feedAppCat(app,cat)].columns;
    for(var i= df.length ; i-- ; ) {
      if(df[i].name==name) {
        if(!df[i].keys)return '';
        for(var j= df[i].keys.length ; j-- ; ) {
          if(df[i].keys[j]==key) {
            return df[i].values[j];
          }
        }
        return '';
      }
    }
    return '';
  }

  
  
  
  
  
  
  
  var errorCount =appData.errorCount;
  
  //
  feedData.initDraft=initDraft;
  feedData.getFeed=getFeed;
  feedData.exploreFeed=exploreFeed;
  //更新、发布相关：
  feedData.updateDraft=updateDraft;
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
  feedData.getFeedDefinitionType=getFeedDefinitionType;

  feedData.usersInfo=appData.userData.usersInfo;//头像等用户信息
  feedData.newMoreLoading={};
  feedData.oldMoreLoading={};
  feedData.hasNewMore={};
  feedData.hasOldest={};// = ! hasOldMore




  return {
    getFeedData:function(){return feedData}
  }
         
}]);

//___________________________________
})();
