'use strict';
(function(){
  
angular.module('exbook')
.factory('ExbookToolsService', 
['$log','$http','$timeout','$location','AppbData',
function ($log,$http,$timeout,$location,AppbData){
  var svc=this;
  var appData=AppbData.getAppData();

  var usersInfo=svc.usersInfo={};//头像等用户信息
  
  /**
   *  获取数组各uid 头像图片地址
   *  输入
   *  arr 数组，每个元素的uid是要获取头像用户
   *  
   *  根据 usersInfo 查现在头像 ，如果对应 uid 已有就跳过
   *  如果没有，就用 /wx/get_users/uid1,uid2,uid3 API获取一堆用户的信息   
   */
  function requireUsersInfo(arr) {
    if(countError()>10)return;
    var ids=[];
    for(var i=arr.length;i--; ) {
      if(arr[i]['uid']>0&&
        !usersInfo[arr[i]['uid']] && 
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
          usersInfo[d[i]['uid']]=d[i];
        }
      },function(e){
        countError(1);
        $log.log('Err:getUsers:',e);
      });
    }
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
    var last=svc.lastError.time;
    //每秒出错次数 -1
    svc.lastError.count -= (now-last)/1000;//js不是整数也可以 ++  不用Math.floor
    svc.lastError.count = Math.max(0,svc.lastError.count);
    if(n) {
      svc.lastError.count++;
      svc.lastError.time = now;
    }
    
    return svc.lastError.count;
  }
  
  svc.lastError={count:0,time:+new Date()}

  return {
    getUsersInfoData:function(){return usersInfo},
    requireUsersInfo:requireUsersInfo,
    countError:countError
  }
         
}]);

//___________________________________
})();
