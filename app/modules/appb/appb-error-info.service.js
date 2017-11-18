'use strict';
(function(){

angular.module('appb')
.factory('AppbErrorInfo',
['$location','$log',
function($location,$log) {
  var MAX_LOG=100;
  var AppbErrorInfo={};
  
  AppbErrorInfo.errData=new Array(MAX_LOG);
  AppbErrorInfo.errIndex=0;
  AppbErrorInfo.errData[AppbErrorInfo.errIndex]={
      content: "系统已正确启动。",
      title: "欢迎您",
      nextPage: '/',
      type: 'success'
  }
  AppbErrorInfo.addInfo=function(title,  content,  nextPage,type) {
    if(type!='success') type='warn';//see appb-ui-oprate-msg.component
    
    AppbErrorInfo.errIndex++;
    if(AppbErrorInfo.errIndex>=MAX_LOG)AppbErrorInfo.errIndex=0;
    
    var contentMore='Url:'+$location.url();
    contentMore+='. Time：' + new Date;
    contentMore+='. User:'+appData.userData.uid;
    contentMore+=', '+appData.userData.tokenid;
    contentMore+=', '+appData.userData.token;
    contentMore+='. ';
    AppbErrorInfo.errData[AppbErrorInfo.errIndex]={
      content: content,
      contentMore: contentMore,
      title: title,
      nextPage:nextPage||'/',
      type:type
    }
    
  }
  AppbErrorInfo.getLastInfo=function() {
    $log.log('AppbErrorInfo.errData',AppbErrorInfo.errData);
    return AppbErrorInfo.errData[AppbErrorInfo.errIndex];
  }
  AppbErrorInfo.showInfoPage=function(title,  content,  nextPage,type) {
    AppbErrorInfo.addInfo(title,content,  nextPage,type);
    $location.path('/sys-page.info');
  }
  
  return AppbErrorInfo;
   
  
}]);
 
  
//___________________________________
})();
