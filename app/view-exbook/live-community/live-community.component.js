'use strict';
(function(){

angular.module('live-community')
.component('liveCommunity',{
    templateUrl: 'view-exbook/live-community/live-community.component.template.html',  
    bindings: {
      livecData:"=",

    
      appData:"="
    },
    controller: ['$scope','$log','$timeout','$element','AmapMainData','LivecData',
      function ($scope,$log,$timeout,$element,AmapMainData,LivecData){
        var ctrl=this;
        var markData;
        
        var mapData=AmapMainData.getMapData();
        ctrl.mapData=mapData;
        
        ctrl.$onInit=function() {
          $log.log('component liveCommunity livecData',ctrl.livecData,ctrl.mapData);
        }


          
      }
    ]
})

})();
