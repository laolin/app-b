'use strict';
(function(){

angular.module('appb')
.component('appbFeedList',{
  templateUrl: 'modules/feed/appb-feed-list.component.template.html',  
  bindings: { 
    //feedData:"<",
    feedApp:"<",
    feedCat:"<",
    //appData:"<"
  },
  controller: ['$log','$timeout','AppbData',
    function ($log,$timeout,AppbData,){
      var ctrl=this;
      
      
      

  var appData=AppbData.getAppData();
  var feedData=appData.feedData;
  ctrl.appData=appData;
  ctrl.feedData=feedData;
  
  
  ctrl.$onInit=function(){
    ctrl.feedAppCat= ctrl.feedData.feedAppCat;
    ctrl.fcat=feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
    if( !feedData.feedAll[ctrl.fcat] || !feedData.feedAll[ctrl.fcat].length) {
      appData.feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat);
    }
  }
  ctrl.$onChanges =function(chg){
  }
  ctrl.$onDestroy=function(){
  }
      

      
      
      
    }
  ]
})


//___________________________________
})();
