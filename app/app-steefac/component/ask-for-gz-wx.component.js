'use strict';
(function(){

angular.module('appb')
.component('askForGzWx',{
  templateUrl: 'app-steefac/component/ask-for-gz-wx.component.template.html',  
  bindings: { 
    canClose: "=",
    show:"<"
  },
  controller: ['$scope','$log','$timeout','AppbData',
    function ($scope,$log,$timeout,AppbData){
      var appData=AppbData.getAppData();
      var ctrl=this;
      ctrl.$onInit=function(){
        ctrl.assetsRoot=appData.appCfg.assetsRoot;
        ctrl.closed=0;
      }
      ctrl.close=function() {
        if(ctrl.canClose)ctrl.closed=1;
        
      }
    }
  ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
