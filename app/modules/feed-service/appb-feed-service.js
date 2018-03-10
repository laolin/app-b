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
    if (feedData.feedAll[fcat]) {
      for (var i = feedData.feedAll[fcat].length; i--;) {
        if (feedData.feedAll[fcat][i].fid == fid) {
          deferred.resolve(feedData.feedAll[fcat][i]);
          return deferred.promise;
        }
      }
    }
    return $http.post("feed/get", {fid}) //, {signType:'single'})
      .then(json => {
        if (json.data.app != app || json.data.cat != cat) {
          return $q.reject('feedtype not match');
        }

        //获取所有的 json.data.uid 的用户信息
        appData.userData.requireUsersInfo([json.data]);

        //获取所有fid下的评论
        AppbCommentService.getComment({ fids: json.data.fid });
        if (json.data.attr)
          json.data.attr = JSON.parse(json.data.attr);

        //用fid作为主键，保存全部feed到feedAllById
        feedData.feedByFid[json.data.fid] = json.data;

        return json.data;
      })
      .catch(json => {
        return $q.reject(json);
      });

  }
  
  /**
   *  para.count=2~200: 数量
   *  para.oldMore=1: 更多旧帖
   *  para.newMore=1: 更多新帖
   */
  function exploreFeed(app,cat,para){
    //由于有自动刷新机制，所以这里允许出错次数不能太多
    //否则在网络条件不好时会过多重复调用没有效果的API
    if(errorCount()>3){
      return $q.reject(-1);
    }
    var pdata={count:10, app:app, cat:cat};
    
    var fcat=feedAppCat(pdata.app,pdata.cat);
    if(!feedData.feedAll[fcat])
      feedData.feedAll[fcat]=[];
    if(para && para.getdel) {
      pdata.getdel=1;
    }
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
    return $http.post("feed/li", pdata) //, {signType:'single'})
      .then(json => {
        //获取所有的 json.data[i].uid 的用户信息
        appData.userData.requireUsersInfo(json.data);

        //获取所有fid下的评论
        var fids = fidList(json.data);
        $log.log('fids', fids);
        AppbCommentService.getComment({ fids: fids.join(',') });
        //

        //返回长度小于请求的长度，说明没有更多旧内容可加载的
        if (json.data.length < pdata.count) {
          feedData.hasOldest[fcat] = true;
        }
        if (pdata.oldmore) { //oldMore
          feedData.feedAll[fcat] = feedData.feedAll[fcat].concat(json.data);
          feedData.oldMoreLoading[fcat] = false;
        } else if (pdata.newmore) {//newMore
          //newMore 如果返回 newMoreCount，说明新的很多，
          //新内容和原来的内容在时间没连续的接上，故要扔掉旧的
          if (json.data.length == newMoreCount) {
            feedData.feedAll[fcat] = json.data;
          } else {
            feedData.feedAll[fcat] = json.data.concat(feedData.feedAll[fcat]);
          }
          feedData.hasNewMore[fcat] = false;
          feedData.newMoreLoading[fcat] = false;
        } else {
          feedData.feedAll[fcat] = json.data;
        }
        var dlist = json.data;
        for (i = dlist.length; i--; i) {
          if (dlist[i].attr) {
            dlist[i].attr = JSON.parse(dlist[i].attr);
          }
          //用fid作为主键，保存全部feed到feedAllById
          feedData.feedByFid[dlist[i].fid] = dlist[i];
        }
        return feedData.feedAll[fcat];
      })
      .catch(json => {
        errorCount(1);
        if (json.errcode == ERR_EB_NOTHING) {
          //appData.toastMsg('已没有更多',3);
          if (pdata.newmore) {
            feedData.hasNewMore[fcat] = false;
          }
          if (pdata.oldmore) {
            feedData.hasOldest[fcat] = true;
          }
        }
        if (pdata.newmore) feedData.newMoreLoading[fcat] = false;
        if (pdata.oldmore) feedData.oldMoreLoading[fcat] = false;
        return $q.reject(json);
      });
  }
  function theFeedIdList(app,cat){
    return fidList(feedData.feedAll[feedAppCat(app,cat)]);
  }
  function fidList(feeds) {
    var ids=[];
    for(var i=feeds.length;i--; ) {
      if(ids.indexOf(feeds[i]['fid'])<0)ids.push(feeds[i]['fid']);
    }
    return ids;
  }  

  function publish(app,cat,drft,dataChanged) {
    if(errorCount()>10) {
      return $q.reject('too many errors');
    }
    var fcat=feedAppCat(app,cat);
    //var drft=feedData.draftAll[fcat];
    if(!drft || drft.flag!='draft'){
      return $q.reject('draft error:'+app+','+cat);
    }
    feedData.publishing=true;
    appData.toastLoading();
    //step1: START: `update-feed`
    return updateFeed(app,cat,drft,dataChanged)
    //step2: after `update-feed` THEN `draft_publish`
    .then(function(){
      return $http.post("feed/draft_publish", {fid: drft.fid});
    })
    //step3: after `draft_publish` THEN:
    .then(function(json){
      //发布成功，把草稿中的 文字、图片 清空，其余不变
      drft.content='';//服务器在发布时也清空了
      drft.pics='';//服务器在发布时也清空了

      appData.toastDone(1);
      feedData.publishing=false;
      return json;
    })
    .catch(function(json){
      if(json.errcode) {
        $log.log('Er:publish:',json.errcode,json.msg);
        if(json.errcode==ERR_EB_INVALID) {
          appData.toastMsg(json.msg,7);
        } else {
          appData.toastMsg('Er:publish:', json.errcode, json.msg, 8);
        }
        errorCount(1);
        feedData.publishing=false;
        return $q.reject(s);
      }
      appData.toastMsg('Ejsonp:publish',8);
      errorCount(1);
      feedData.publishing=false;
      return $q.reject(json);
    });
  }
  

  function updateFeed(app,cat,feedFullObj,dataChanged) {
    $log.log('updateFeed->>',feedFullObj,dataChanged);
    var deferred = $q.defer();
    var fcat=feedAppCat(app,cat);

    if(svc.isUpdating) {
      return $timeout(function(){return updateFeed(app,cat,feedFullObj,dataChanged)},500);
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
      deferred.resolve(feedFullObj);//继续返回feed内容
      return deferred.promise;
    }
    
    var updateType='feed_update';
    if(feedFullObj.flag=='draft')updateType='draft_update';

    data.fid=feedFullObj.fid;
    return $http.post("feed/" + updateType, data) //, {signType:'single'})
    .then( json => {
      for (var attr in dataChanged) {
        if (2 == dataChanged[attr])// 2 更新成功->0
          dataChanged[attr] = 0;
      }
      svc.isUpdating = false;
      deferred.resolve(feedFullObj);//继续返回feed内容
      return feedFullObj;
    })
    .catch( json =>{
      errorCount(1);
      for (var attr in dataChanged) {
        if(2 == dataChanged[attr])// 2 更新失败->1
          dataChanged[attr]=1;                    
      }
      appData.toastMsg('feed_update error');
      svc.isUpdating=false;
      return $q.reject(json);
    });
  }
  
  
  //删除一条
  function deleteFeed(fid,app,cat) {
    appData.dialogData.confirmDialog('删除此条',function(){_confirmedDeleteFeed(fid,app,cat)});
  }
  function _confirmedDeleteFeed(fid,app,cat) {
    return $http.post("feed/del", { fid }) //, {signType:'single'})
      .then(json => {
        var fcat = feedAppCat(app, cat);
        //删除成功
        for (var i = feedData.feedAll[fcat].length; i--;) {
          if (feedData.feedAll[fcat][i].fid == fid) {
            feedData.feedAll[fcat].splice(i, 1);
            //TODO: 服务器端会留下一堆无头的评论，待处理
            break;
          }
        }
        appData.toastDone(1);
      })
      .catch(json => {
        errorCount(1);
        if (json.errcode) {
          var info = 'E:DelF:' + json.errcode + ":" + json.msg;
          $log.log(info);
          appData.toastMsg(info, 8);
          return;
        }
        return $q.reject(json);
      });
  }
  function changeFeedAccess(app,cat,fid,access) {
    return $http.post("feed/change_access", { fid, access }) //, {signType:'single'})
      .then(json => {
      })
      .catch(json => {
        errorCount(1);
        if (json.errcode) {
          var info = 'E:DelF:' + json.errcode + ":" + json.msg;
          $log.log(info);
          appData.toastMsg(info, 8);
          return  $q.reject(info);
        }
        return $q.reject(json);
      });
  }
  
  function initDraft(app,cat) {
    var deferred = $q.defer();
    if(feedData.draftAll[feedAppCat(app,cat)]) {
      deferred.resolve(feedData.draftAll[feedAppCat(app,cat)]);
      return deferred.promise;
    }

    // var api=appData.url---SignApi('feed','draft_init');
    // if(!api){
    //   appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
    //   deferred.reject('requireLogin');
    //   return deferred.promise;
    // }
    // return $http.jsonp(api, {params:{app:app,cat:cat}})
    return $http.post("feed/draft_init", {app, cat}) //, {signType:'single'})
    .then(function(res){
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
  function defineFeed(app,desc,columns) {
    feedDefinition[app]={desc:desc,columns:columns};
  }
  function getFeedDefinition(app) {
    return feedDefinition[app];
  }
  function getFeedDefinitionType(app,name) {
    var df = feedDefinition[app].columns;
    for(var i= df.length ; i-- ; ) {
      if(df[i].name==name) {
        return df[i].type
      }
      return '';
    }
    return '';
  }
  function getFeedDefinitionValue(app,name,key) {
    var df = feedDefinition[app].columns;
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
  feedData.theFeedIdList=theFeedIdList;
  //更新、发布相关：
  feedData.updateFeed=updateFeed;
  feedData.publish=publish;
  feedData.publishing=false;
  feedData.feedAppCat=feedAppCat;
  feedData.deleteFeed=deleteFeed;
  feedData.changeFeedAccess=changeFeedAccess;
  
  feedData.draftAll={};//_draft
  feedData.feedAll={};//feedList
  feedData.feedByFid={};
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
