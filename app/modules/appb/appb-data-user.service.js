'use strict';
(function(){

var KEY_USERDATA=appbCfg.keyUserData;
var RIGHTS_ADMIN = 0x00010000;//TODO 和服务器端统一文件

angular.module('appb')
.factory('AppbDataUser',
['$http','$window','$location','$log','$timeout','$q', "SIGN",
function($http, $window,$location,$log,$timeout,$q, SIGN)
{
  var userData={};
  var u_saved=JSON.parse($window.localStorage.getItem(KEY_USERDATA)||'{}');
  this.userData=userData;
  
  var usersInfo={};//头像等用户信息

  
  
  //factory functions
  function getUserData() {
    return userData;
  }
  function saveUserDataToLocalStorage() {
    $window.localStorage.setItem(KEY_USERDATA,JSON.stringify(userData));
  }
  function setUserData(obj) {
    for (var attr in userData) {//由于外部引用了userData变量，故不能重赋值。只能修改属性。
      if (userData.hasOwnProperty(attr)) delete userData[attr];
    }
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) userData[attr] = obj[attr];
    }
    
    _initUserData();
    dealWxHeadImg(userData.wxinfo);
    saveUserDataToLocalStorage();
    return userData;
  }
  //处理头像
  function dealWxHeadImg(wxinfo) {
    if(wxinfo  &&  wxinfo.headimgurl ) {
      
      //处理网站是https的情况
      //把前面的 http: 去掉即可自动 http或https 协议
      var face=wxinfo.headimgurl;
      if(face.substr(0,5)=='http:') {
        wxinfo.headimgurl=face.substr(5);
      }
      
      /*（这样有点费内存，考虑不要各种大小的头像？）
      //处理其他大小的头像
      face=wxinfo.headimgurl;
      if(face.substr(-2)=='/0') {
        var f0=face.substr(0,face.length-2);
        wxinfo.headimgurl_46=f0+'/46';
        wxinfo.headimgurl_64=f0+'/64';
        wxinfo.headimgurl_96=f0+'/96';
        wxinfo.headimgurl_132=f0+'/132';
      }
      */
        
    }
  }
  

  //
  function addApiSignature(dat,api,call) {
    var dt=new Date()
    var tim=Math.round(dt.getTime()/1000) -8*3600- dt.getTimezoneOffset()*60;//修正为东8区

    dat.uid=userData.uid;
    dat.tokenid=userData.tokenid;
    
    dat.timestamp= tim;
    dat.api_signature=md5(api+call+userData.uid+userData.token+tim);
    return dat;
  }
  function isAdmin() {
    return (userData.rights & RIGHTS_ADMIN)
  }
  
  /** 只返回所请求的用户数组 */
  function singleUserinfo(arr) {
    return Object.keys(arr)
    .map(k => {
      return Object.keys(usersInfo)
      .map(kUser => usersInfo[kUser])
      .find(user => user.uid == arr[k].uid)
    })
    .filter(item => !!item);
  }
  //独立部署的SERVER for user api
  /**
  *  获取数组各uid 头像图片地址
  *  输入
  *  arr 数组，每个元素的uid是要获取头像用户
  *  
  *  根据 usersInfo 查现在头像 ，如果对应 uid 已有就跳过
  *  如果没有，就用 /wx/get_users/uid1,uid2,uid3 API获取一堆用户的信息   
  */
  function requireUsersInfo(arr) {
    var ids=[];
    for(var i=arr.length;i--; ) {
      if(arr[i]['uid']>0&&
        !usersInfo[arr[i]['uid']] && 
        ids.indexOf(arr[i]['uid'])<0)ids.push(arr[i]['uid']);
    }
    if(!ids.length) {
      // 只返回所请求的用户数组
      return $q.resolve(singleUserinfo(arr, usersInfo));
    }
    var api=appData.urlSignApi('wx','get_users',ids.join(','));
    return $http.jsonp(api).then(function(s){
      if(s.data.errcode!=0) {
        return $q.reject(-2);
      }
      var d=s.data.data;
      for(var i=d.length;i--; ) {
        dealWxHeadImg(d[i].wxinfo);
        usersInfo[d[i]['uid']]=d[i];
      }
      // 只返回所请求的用户数组
      return $q.resolve(singleUserinfo(arr, usersInfo));
    },function(e){
      $log.log('Err:getUsers:',e);
      return $q.reject(e);
    });
  }

  /**
  *  获取数组各 uid 头像图片地址
  *  @param userids 数组
  *  根据 usersInfo 查现在头像 ，如果对应 uid 已有就跳过
  *  如果没有，就用向后台请求
  */
  function requireWxInfo(userids) {
    var cache = requireWxInfo.cache || (requireWxInfo.cache = []);
    if(!userids){
      return $q.reject('错误的请求');
    }
    var idsNew = [];
    userids.map( userid => {
      if(!userid) return;
      if(cache.find(item => item.uidBinded == userid)) return;
      idsNew.push(userid);
    })
    if(!idsNew.length) {
      // 只返回所请求的用户数组
      return $q.resolve(cache.filter(item => userids.indexOf(item.uidBinded) >= 0));
    }
    return SIGN.post('sa_data', 'getWxInfo', {userid: idsNew})
    .then(json => json.datas)
    .then(list => {
      console.log('得到微信信息：', list);
      list.map( item =>{
        dealWxHeadImg(item);
        if(!cache.find(item_cache => item.uidBinded == item_cache.uidBinded)){
          cache.push(item);
        }
      })
      // 只返回所请求的用户数组
      return cache.filter(item => userids.indexOf(item.uidBinded) >= 0);
    },function(e){
      $log.log('Err:getUsers:',e);
      return $q.reject(e);
    });
  }
  

  function _initUserData() {
    // == prop: ==============
    userData.usersInfo=usersInfo;

    //== method: ==============
    userData.dealWxHeadImg=dealWxHeadImg;
    userData.isAdmin=isAdmin;
    userData.requireUsersInfo=requireUsersInfo;
    userData.requireWxInfo = requireWxInfo;
  }  
  
  setUserData(u_saved);
  
  return {
    addApiSignature:addApiSignature,
    saveUserDataToLocalStorage:saveUserDataToLocalStorage,
    dealWxHeadImg:dealWxHeadImg,
    getUserData:getUserData,
    setUserData:setUserData
  }
  
}]);
 
  
//__________________________________________
})();
