'use strict';
(function(){

angular.module('appb')
.controller('appbCtrl',
  ['$scope','$log','AppbData',
  function ($scope,$log,AppbData){
    var appb=this;
    appb.appData=AppbData.getAppData();
    appb.headerData=AppbData.getHeaderData();
    appb.footerData=AppbData.getFooterData();
    appb.dialogData=AppbData.getDialogData();

    appb.startPathMonitor=AppbData.startPathMonitor;
    //监控路由变化
    appb.startPathMonitor();

  }]
)//end of function controller

//___________________________________
})();
