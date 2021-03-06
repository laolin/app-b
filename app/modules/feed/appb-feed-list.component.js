'use strict';
(function(){

angular.module('appb')
.component('appbFeedList',{
  templateUrl: 'modules/feed/appb-feed-list.component.template.html',  
  bindings: { 
    hidePoster: "<",
    //feedData:"<",
    feedApp:"<",
    feedCat:"<",
    //appData:"<"
  },
  controller: ['$log','$timeout','AppbData',
    function ($log,$timeout,AppbData){
      var ctrl=this;
      
      
      

  var appData=AppbData.getAppData();
  var feedData=appData.feedData;
  ctrl.appData=appData;
  ctrl.feedData=feedData;
  
  
  ctrl.$onInit=init
  function init(){
    ctrl.feedAppCat= ctrl.feedData.feedAppCat;
    ctrl.fcat=feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
    if( !feedData.feedAll[ctrl.fcat] || !feedData.feedAll[ctrl.fcat].length) {
      ctrl.isLoading=1;
      appData.feedData.exploreFeed(ctrl.feedApp,ctrl.feedCat).then(function(){
        ctrl.isLoading=0;
      },function(e){
        ctrl.isLoading=0;
      });
    }
  }
  ctrl.$onChanges =init
  ctrl.$onDestroy=function(){
  }
      

      
      
      
    }
  ]
})


//___________________________________
})();
