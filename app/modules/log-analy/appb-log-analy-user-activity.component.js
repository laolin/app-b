'use strict';
(function(){

angular.module('appb')
.component('appbLogAnalyUserActivity',{
  templateUrl: 'modules/log-analy/appb-log-analy-user-activity.component.template.html',  
  bindings: { 
    day:"<",
    hour:"<",
    logdddddData:"<"
  },
  controller: ['$log','$timeout','AppbData',
    function ($log,$timeout,AppbData){
      var ctrl=this;
      
      ctrl.$onInit=function(){
      }
      ctrl.$onChanges =function(chg){
      }
      ctrl.$onDestroy=function(){
      }
      
      var userData=AppbData.getUserData();
      var appData=AppbData.getAppData();
      ctrl.userData=userData;
      ctrl.logData=appData.logData;
      
      
    }
  ]
})


//___________________________________
})();
