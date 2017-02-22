'use strict';
(function(){

var KEY_USERDATA=appbCfg.keyUserData;

angular.module('appb')
.factory('AppbDataUser',
['$route','$window','$location','$log','$timeout',
function($route, $window,$location,$log,$timeout)
{
  var userData={};
  var u_saved=JSON.parse($window.localStorage.getItem(KEY_USERDATA));
  setUserData(u_saved);
  this.userData=userData;
  
  
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
    saveUserDataToLocalStorage();
    return userData;
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
  
  return {
    addApiSignature:addApiSignature,
    saveUserDataToLocalStorage:saveUserDataToLocalStorage,
    getUserData:getUserData,
    setUserData:setUserData
  }
  
}]);
 
  
//__________________________________________
})();
