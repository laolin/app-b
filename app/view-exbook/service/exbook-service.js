'use strict';
(function(){
  
//错误代码和服务器相关。服务器统一整理调整时要一并调整
var
  ERR_EB_INVALID=202002,//内容无效
  ERR_EB_NOTHING=202003,//获取结果为空

  ERR_OK=0;
angular.module('exbook')
.factory('ExbookService', 
['$log','$http','$timeout','$location','AppbData',
function ($log,$http,$timeout,$location,AppbData){
  var svc=this;
  var ebData={draft:{}};//草稿
  var appData=AppbData.getAppData();
  var config=false;

  appData.ebData=ebData;
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
      getUsers(s.data.data);
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
  
  /**
   *  获取数组各uid 头像图片地址
   *  输入
   *  arr 数组，每个元素的uid是要获取头像用户
   *  
   *  根据 usersInfo 查现在头像 ，如果对应 uid 已有就跳过
   *  如果没有，就用 /wx/get_users/uid1,uid2,uid3 API获取一堆用户的信息   
   */
  function getUsers(arr) {
    if(countError()>10)return;
    var ids=[];
    for(var i=arr.length;i--; ) {
      if(!ebData.usersInfo[arr[i]['uid']] && 
        ids.indexOf(arr[i]['uid'])<0)ids.push(arr[i]['uid']);
    }
    if(ids.length) {
      var api=appData.urlSignApi('wx','get_users',ids.join(','));
      $http.jsonp(api).then(function(s){
        if(s.data.errcode!=0) {
          $log.log('Err:getUsers:',s.data.errcode,s.data.msg);
          countError(1);
          return;
        }
        var d=s.data.data;
        for(i=d.length;i--; ) {
          ebData.usersInfo[d[i]['uid']]=d[i];
        }
      },function(e){
        countError(1);
        $log.log('Err:getUsers:',e);
      });
    }
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
          
        ebData.hasNewMore=true;
        $location.path( "/explore" );
        exploreFeed({newMore:1});//自动刷新新帖
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
  /**
   *  计算出错次数，避免网络不好出错后继续频繁刷新
   *  
   *  n : true值  => 加一次出错
   *  n : false值 => 直接返回出错次数
   *  记录上次出错时间，每秒出错次数 -1
   */
  function countError(n) {
    var now=+new Date();
    var last=ebData.lastError.time;
    //每秒出错次数 -1
    ebData.lastError.count -= (now-last)/1000;//js不是整数也可以 ++  不用Math.floor
    ebData.lastError.count = Math.max(0,ebData.lastError.count);
    if(n) {
      ebData.lastError.count++;
      ebData.lastError.time = now;
    }
    
    return ebData.lastError.count;
  }
  
  //
  ebData.initDraft=initDraft;
  ebData.exploreFeed=exploreFeed;
  //更新、发布相关：
  ebData.changeMark=changeMark;
  ebData.updateData=updateData;
  ebData.publish=publish;
  ebData.publishing=false;
  
  ebData.feedList=[];
  ebData.usersInfo={};//头像等用户信息
  ebData.newMoreLoading=false;
  ebData.oldMoreLoading=false;
  ebData.hasNewMore=false;
  ebData.hasOldMore=true;
  ebData.lastError={count:0,time:+new Date()}
  initDraft();
  init_cfg();
  exploreFeed();//先预读feed


  return {
    getEbData:function(){return ebData}
  }
         
}]);

//___________________________________
})();
