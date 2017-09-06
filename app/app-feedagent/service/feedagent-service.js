'use strict';
(function(){
  
angular.module('feedagent')
.factory('FeedAgent', 
['$log','$http','$timeout','$location','$q','AppbData','AppbDataUser',
function ($log,$http,$timeout,$location,$q,AppbData,AppbDataUser){
  var svc=this;
  var appData=AppbData.getAppData();
  
  var userData=appData.userData;
  svc.feedAgent={}


  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  
  appData.feedAgent=svc.feedAgent;

  svc.feedAgent.getParameterByName=getParameterByName;

  return svc.feedAgent;
         
}]);

//___________________________________
})();
